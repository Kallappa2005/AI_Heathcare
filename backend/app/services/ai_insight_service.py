import io
import json
import logging
import os
import re
from collections import Counter
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

import fitz  # PyMuPDF
import pytesseract
import requests
from PIL import Image

from app.utils.database import get_supabase_client

logger = logging.getLogger(__name__)

# Keywords that increase clinical risk when detected in extracted text
CRITICAL_KEYWORDS = {
    'hypertensive crisis': 18,
    'myocardial infarction': 22,
    'ischemia': 15,
    'tachycardia': 10,
    'bradycardia': 10,
    'sepsis': 20,
    'respiratory failure': 22,
    'hypoxia': 15,
    'acute kidney injury': 12,
    'stroke': 22,
    'arrhythmia': 12,
    'pulmonary embolism': 20,
    'high risk': 10,
    'critical': 8,
    'unstable': 8
}

STOPWORDS = {
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'patient', 'pain', 'were', 'they',
    'which', 'will', 'been', 'into', 'also', 'than', 'then', 'there', 'their', 'about', 'without',
    'within', 'between', 'because', 'should', 'could', 'would', 'while', 'over'
}

MAX_MODEL_INPUT_CHARS = 4000


class AIInsightsService:
    """Service that converts nurse-uploaded PDFs into AI insights stored in ai_insights table."""

    def __init__(self) -> None:
        self.supabase = get_supabase_client()
        self.bucket_name = os.getenv('SUPABASE_PDF_BUCKET', 'patient-documents')
        self.patient_path_template = os.getenv('SUPABASE_PDF_PATH_TEMPLATE', '{patient_id}')
        self.hf_api_url = os.getenv('HF_INFERENCE_URL', 'https://api-inference.huggingface.co/models/google/flan-t5-small')
        self.hf_api_token = os.getenv('HF_API_TOKEN')
        self.ocr_language = os.getenv('OCR_LANGUAGE', 'eng')
        tesseract_cmd = os.getenv('TESSERACT_CMD')
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def generate_patient_insight(
        self,
        patient_id: str,
        created_by: Optional[str] = None
    ) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """Pull latest PDF for patient, run OCR/LLM analysis, store and return insight."""
        document = self._get_latest_patient_document(patient_id)
        if not document:
            return False, 'No PDF found for this patient in storage bucket', None

        pdf_bytes = self._download_document(document['path'])
        if not pdf_bytes:
            return False, 'Unable to download PDF from Supabase storage', None

        extracted_text, extraction_mode = self._extract_text_from_pdf(pdf_bytes)
        if not extracted_text.strip():
            return False, 'OCR engine did not detect any readable text inside PDF', None

        latest_vitals = self._get_latest_vitals(patient_id)
        analysis = self._analyze_text(extracted_text, latest_vitals)
        analysis['model_version'] = analysis.get('model_version') or 'ocr-v1'

        payload = {
            'patient_id': patient_id,
            'risk_score': analysis['risk_score'],
            'ai_summary': analysis['ai_summary'],
            'risk_factors': analysis['risk_factors'],
            'recommendations': analysis['recommendations'],
            'key_terms': analysis['key_terms'],
            'confidence_score': analysis['confidence_score'],
            'model_version': analysis['model_version'],
            'created_by': created_by
        }

        try:
            result = self.supabase.table('ai_insights').insert(payload).execute()
            if not result.data:
                return False, 'Supabase did not return the stored insight', None

            saved_row = result.data[0]
            saved_row['sourceDocument'] = {
                'storagePath': document['path'],
                'fileName': document['name'],
                'extractionMode': extraction_mode,
                'extractedAt': datetime.now(timezone.utc).isoformat()
            }
            saved_row['latestVitals'] = latest_vitals
            saved_row['sourceExcerpt'] = analysis.get('source_excerpt', '')
            return True, 'AI insight generated successfully', saved_row
        except Exception as exc:  # pragma: no cover - defensive logging
            logger.exception('Failed to insert AI insight: %s', exc)
            return False, f'Failed to persist AI insight: {exc}', None

    def get_patient_insights(self, patient_id: str, limit: int = 5) -> Tuple[bool, str, List[Dict[str, Any]]]:
        """Return recent AI insights for a patient."""
        try:
            result = self.supabase.table('ai_insights') \
                .select('*') \
                .eq('patient_id', patient_id) \
                .order('created_at', desc=True) \
                .limit(limit) \
                .execute()

            return True, 'Insights fetched successfully', result.data or []
        except Exception as exc:  # pragma: no cover - defensive logging
            logger.exception('Failed to fetch insights: %s', exc)
            return False, f'Failed to fetch insights: {exc}', []

    def list_latest_insights(self, limit: int = 100) -> Tuple[bool, str, List[Dict[str, Any]]]:
        """Return latest insight per patient with minimal patient metadata."""
        try:
            insights_result = self.supabase.table('ai_insights') \
                .select('*') \
                .order('created_at', desc=True) \
                .limit(limit) \
                .execute()

            rows = insights_result.data or []
            latest_per_patient: Dict[str, Dict[str, Any]] = {}
            for row in rows:
                patient_id = row.get('patient_id')
                if patient_id and patient_id not in latest_per_patient:
                    latest_per_patient[patient_id] = row

            if not latest_per_patient:
                return True, 'No insights available yet', []

            patient_ids = list(latest_per_patient.keys())
            patients_lookup = self._fetch_patient_metadata(patient_ids)

            combined = []
            for pid, insight in latest_per_patient.items():
                patient_meta = patients_lookup.get(pid, {})
                combined.append({
                    'patient': patient_meta,
                    'insight': insight
                })

            return True, 'Latest insights fetched', combined
        except Exception as exc:  # pragma: no cover - defensive logging
            logger.exception('Failed to list insights: %s', exc)
            return False, f'Failed to list insights: {exc}', []

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------
    def _fetch_patient_metadata(self, patient_ids: List[str]) -> Dict[str, Dict[str, Any]]:
        if not patient_ids:
            return {}

        try:
            result = self.supabase.table('patients') \
                .select('id, first_name, last_name, gender, date_of_birth, medical_record_number') \
                .in_('id', patient_ids) \
                .execute()

            lookup = {}
            for row in result.data or []:
                lookup[row['id']] = {
                    'id': row['id'],
                    'fullName': f"{row.get('first_name', '')} {row.get('last_name', '')}".strip(),
                    'gender': row.get('gender'),
                    'dateOfBirth': row.get('date_of_birth'),
                    'medicalRecordNumber': row.get('medical_record_number')
                }
            return lookup
        except Exception as exc:  # pragma: no cover - defensive logging
            logger.exception('Failed to fetch patient metadata: %s', exc)
            return {}

    def _get_latest_patient_document(self, patient_id: str) -> Optional[Dict[str, Any]]:
        path_prefix = self.patient_path_template.format(patient_id=patient_id).strip('/')
        try:
            listing = self.supabase.storage.from_(self.bucket_name).list(
                path_prefix or '',
                {
                    'limit': 100,
                    'offset': 0,
                    'sortBy': {
                        'column': 'created_at',
                        'order': 'desc'
                    }
                }
            )
        except Exception as exc:
            logger.error('Failed to list Supabase storage objects: %s', exc)
            return None

        if not listing:
            return None

        pdf_files = [item for item in listing if item.get('name', '').lower().endswith('.pdf')]
        if not pdf_files:
            return None

        pdf_files.sort(key=lambda item: item.get('created_at') or '', reverse=True)
        latest = pdf_files[0]
        latest['path'] = f"{path_prefix}/{latest['name']}" if path_prefix else latest['name']
        return latest

    def _download_document(self, storage_path: str) -> Optional[bytes]:
        try:
            return self.supabase.storage.from_(self.bucket_name).download(storage_path)
        except Exception as exc:
            logger.error('Failed to download %s from storage: %s', storage_path, exc)
            return None

    def _extract_text_from_pdf(self, pdf_bytes: bytes) -> Tuple[str, str]:
        try:
            document = fitz.open(stream=pdf_bytes, filetype='pdf')
        except Exception as exc:
            logger.error('Unable to open PDF bytes: %s', exc)
            return '', 'unreadable'

        try:
            text_chunks: List[str] = []
            for page in document:
                text = page.get_text('text') or ''
                if text.strip():
                    text_chunks.append(text)

            if text_chunks:
                return '\n'.join(text_chunks), 'digital'
        finally:
            document.close()

        # Second pass with OCR
        try:
            document = fitz.open(stream=pdf_bytes, filetype='pdf')
            ocr_chunks: List[str] = []
            for page_index, page in enumerate(document):
                pix = page.get_pixmap(dpi=300)
                mode = 'RGB' if pix.samples_per_pixel == 3 else 'RGBA'
                image = Image.frombytes(mode, [pix.width, pix.height], pix.samples)
                ocr_text = pytesseract.image_to_string(image, lang=self.ocr_language)
                if ocr_text.strip():
                    ocr_chunks.append(ocr_text)
                logger.debug('OCR ran for patient PDF page %s (%s chars)', page_index, len(ocr_text))

            return '\n'.join(ocr_chunks), 'ocr'
        except Exception as exc:
            logger.error('OCR processing failed: %s', exc)
            return '', 'ocr-error'
        finally:
            document.close()

    def _get_latest_vitals(self, patient_id: str) -> Optional[Dict[str, Any]]:
        try:
            result = self.supabase.table('vital_uploads') \
                .select('*') \
                .eq('patient_id', patient_id) \
                .order('recorded_at', desc=True) \
                .limit(1) \
                .execute()

            return result.data[0] if result.data else None
        except Exception:
            return None

    def _analyze_text(self, text: str, vitals: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        trimmed_text = text.strip()
        if len(trimmed_text) > MAX_MODEL_INPUT_CHARS:
            trimmed_text = trimmed_text[:MAX_MODEL_INPUT_CHARS]

        llm_response = self._call_hf_model(trimmed_text)
        if llm_response:
            llm_response['source_excerpt'] = trimmed_text[:800]
            return llm_response

        heuristic = self._heuristic_analysis(trimmed_text, vitals)
        heuristic['source_excerpt'] = trimmed_text[:800]
        return heuristic

    def _call_hf_model(self, text: str) -> Optional[Dict[str, Any]]:
        if not self.hf_api_token:
            return None

        prompt = (
            'You are a clinical risk stratification model. '
            'Read the following clinical note extracted from a PDF and return JSON with the keys '
            'ai_summary (string), risk_score (0-100 int), risk_factors (array of strings), '
            'recommendations (array of strings), key_terms (array of strings), confidence_score (0-1 float). '\
            'Use concise medical language.\nDocument:\n'
            f"{text}\nJSON:"
        )

        headers = {
            'Authorization': f'Bearer {self.hf_api_token}',
            'Content-Type': 'application/json'
        }
        payload = {
            'inputs': prompt,
            'parameters': {
                'max_new_tokens': 256,
                'temperature': 0.2
            }
        }

        try:
            response = requests.post(self.hf_api_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            body = response.json()
            generated = ''
            if isinstance(body, list) and body:
                generated = body[0].get('generated_text', '')
            elif isinstance(body, dict):
                generated = body.get('generated_text') or body.get('data', '')

            if not generated:
                return None

            json_candidate = self._extract_json_blob(generated)
            if not json_candidate:
                return None

            parsed = json.loads(json_candidate)
            return {
                'ai_summary': parsed.get('ai_summary', '').strip(),
                'risk_score': int(parsed.get('risk_score', 50)),
                'risk_factors': parsed.get('risk_factors', []) or [],
                'recommendations': parsed.get('recommendations', []) or [],
                'key_terms': parsed.get('key_terms', []) or [],
                'confidence_score': float(parsed.get('confidence_score', 0.7)),
                'model_version': 'ocr-v1-hf'
            }
        except Exception as exc:  # pragma: no cover - network/LLM failures
            logger.warning('Hugging Face inference fallback triggered: %s', exc)
            return None

    def _extract_json_blob(self, text: str) -> Optional[str]:
        start = text.find('{')
        end = text.rfind('}')
        if start == -1 or end == -1 or end <= start:
            return None
        candidate = text[start:end + 1]
        attempts = [candidate, candidate.replace("'", '"')]
        for attempt in attempts:
            try:
                json.loads(attempt)
                return attempt
            except json.JSONDecodeError:
                continue
        return None

    def _heuristic_analysis(self, text: str, vitals: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        text_lower = text.lower()
        risk_score = 40
        risk_factors: List[str] = []
        recommendations: List[str] = []

        for keyword, weight in CRITICAL_KEYWORDS.items():
            if keyword in text_lower:
                risk_score += weight
                risk_factors.append(keyword.title())

        bp_match = re.search(r'(?:bp|blood pressure)[^0-9]*([0-9]{2,3})\s*/\s*([0-9]{2,3})', text_lower)
        if bp_match:
            systolic = int(bp_match.group(1))
            diastolic = int(bp_match.group(2))
            if systolic >= 160 or diastolic >= 100:
                risk_score += 12
                risk_factors.append(f'Hypertensive reading {systolic}/{diastolic}')
                recommendations.append('Optimize antihypertensive regimen and monitor BP daily')

        hr_match = re.search(r'(?:hr|heart rate)[^0-9]*([0-9]{2,3})', text_lower)
        if hr_match:
            heart_rate = int(hr_match.group(1))
            if heart_rate >= 110 or heart_rate <= 50:
                risk_score += 8
                risk_factors.append(f'Heart rate out of range ({heart_rate} bpm)')

        spo2_match = re.search(r'(?:spo2|oxygen saturation)[^0-9]*([0-9]{2,3})', text_lower)
        if spo2_match:
            spo2 = int(spo2_match.group(1))
            if spo2 < 92:
                risk_score += 10
                risk_factors.append(f'Oxygen saturation {spo2}%')
                recommendations.append('Initiate supplemental oxygen and evaluate respiratory status')

        if vitals:
            risk_score += self._score_from_vitals(vitals, risk_factors, recommendations)

        risk_score = max(0, min(100, risk_score))
        if not recommendations:
            recommendations.append('Schedule follow-up visit within 7 days and review medication adherence')

        summary = self._build_summary(text)
        key_terms = self._extract_key_terms(text)
        confidence = 0.55 + min(0.35, len(risk_factors) * 0.03)

        return {
            'ai_summary': summary,
            'risk_score': int(risk_score),
            'risk_factors': risk_factors[:6],
            'recommendations': recommendations[:6],
            'key_terms': key_terms,
            'confidence_score': round(confidence, 2),
            'model_version': 'ocr-v1-heuristic'
        }

    def _score_from_vitals(
        self,
        vitals: Dict[str, Any],
        risk_factors: List[str],
        recommendations: List[str]
    ) -> int:
        delta = 0
        try:
            heart_rate = float(vitals.get('heart_rate')) if vitals.get('heart_rate') is not None else None
            systolic = float(vitals.get('blood_pressure_systolic')) if vitals.get('blood_pressure_systolic') is not None else None
            diastolic = float(vitals.get('blood_pressure_diastolic')) if vitals.get('blood_pressure_diastolic') is not None else None
            oxygen = float(vitals.get('oxygen_saturation')) if vitals.get('oxygen_saturation') is not None else None
        except (TypeError, ValueError):
            return delta

        if heart_rate is not None and (heart_rate >= 110 or heart_rate <= 50):
            delta += 10
            risk_factors.append(f'Recent heart rate {int(heart_rate)} bpm')

        if systolic is not None and diastolic is not None:
            if systolic >= 160 or diastolic >= 100:
                delta += 12
                risk_factors.append(f'Recent BP {int(systolic)}/{int(diastolic)}')
                recommendations.append('Review antihypertensive dosing and lifestyle adherence')

        if oxygen is not None and oxygen < 92:
            delta += 10
            risk_factors.append(f'Oxygen saturation {oxygen}% from vitals upload')

        return delta

    def _build_summary(self, text: str) -> str:
        sentences = re.split(r'(?<=[.!?])\s+', text.strip())
        if not sentences:
            return 'No structured summary available from document.'
        return ' '.join(sentences[:2]).strip()

    def _extract_key_terms(self, text: str, limit: int = 5) -> List[str]:
        words = re.findall(r'[A-Za-z]{4,}', text)
        normalized = [w.lower() for w in words if w.lower() not in STOPWORDS]
        counts = Counter(normalized)
        top_terms = [term.title() for term, _ in counts.most_common(limit)]
        return top_terms
