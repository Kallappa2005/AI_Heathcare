# Patient service for managing patient operations
from typing import Optional, Dict, Any, Tuple, List
from app.models.patient import Patient
from app.utils.database import get_supabase_client
import re
from datetime import datetime

class PatientService:
    """Service class for patient management operations"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
    
    def validate_patient_id(self, patient_id: str) -> bool:
        """Validate patient ID format"""
        if not patient_id:
            return False
        
        # Allow alphanumeric and hyphens, minimum 3 characters
        pattern = r'^[A-Za-z0-9\-]{3,}$'
        return bool(re.match(pattern, patient_id))
    
    def patient_id_exists(self, patient_id: str) -> bool:
        """Check if patient ID already exists"""
        try:
            result = self.supabase.table('patients').select('id').eq('medical_record_number', patient_id).execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"Error checking patient ID existence: {str(e)}")
            return False
    
    def email_exists(self, email: str, exclude_id: str = None) -> bool:
        """Check if email already exists for another patient"""
        try:
            query = self.supabase.table('patients').select('id').eq('email', email)
            if exclude_id:
                query = query.neq('id', exclude_id)
            
            result = query.execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"Error checking email existence: {str(e)}")
            return False
    
    def register_patient(self, patient_data: Dict[str, Any], created_by: str) -> Tuple[bool, str, Optional[Patient]]:
        """Register a new patient"""
        try:
            # Create patient object from form data
            patient = Patient.from_dict(patient_data)
            patient.created_by = created_by
            patient.medical_record_number = patient_data.get('patientId')
            
            # Validate patient data
            is_valid, validation_message = patient.validate()
            if not is_valid:
                return False, validation_message, None
            
            # Validate patient ID format
            patient_id = patient_data.get('patientId', '').strip()
            if not self.validate_patient_id(patient_id):
                return False, "Patient ID must be at least 3 characters and contain only letters, numbers, and hyphens", None
            
            # Check if patient ID already exists
            if self.patient_id_exists(patient_id):
                return False, "Patient ID already exists. Please use a different ID", None
            
            # Check if email already exists (if provided)
            if patient.email and self.email_exists(patient.email):
                return False, "Email address already exists for another patient", None
            
            # Prepare data for database insertion
            db_data = patient.to_db_dict()
            
            # Insert patient into database
            result = self.supabase.table('patients').insert(db_data).execute()
            
            if result.data and len(result.data) > 0:
                # Get the inserted patient data with generated ID
                inserted_data = result.data[0]
                patient.id = inserted_data.get('id')
                patient.created_at = datetime.fromisoformat(inserted_data.get('created_at', '').replace('Z', '+00:00'))
                patient.updated_at = datetime.fromisoformat(inserted_data.get('updated_at', '').replace('Z', '+00:00'))
                
                return True, "Patient registered successfully", patient
            else:
                return False, "Failed to register patient", None
                
        except Exception as e:
            print(f"Patient registration error: {str(e)}")
            return False, f"Registration failed: {str(e)}", None
    
    def get_all_patients(self, created_by: str = None) -> Tuple[bool, str, Optional[List[Patient]]]:
        """Get all patients"""
        try:
            query = self.supabase.table('patients').select('*').order('created_at', desc=True)
            
            # If created_by is provided, filter by creator (for role-based access)
            if created_by:
                query = query.eq('created_by', created_by)
            
            result = query.execute()
            
            if result.data:
                patients = []
                for patient_data in result.data:
                    patient = Patient.from_dict(patient_data)
                    patients.append(patient)
                
                return True, "Patients retrieved successfully", patients
            else:
                return True, "No patients found", []
                
        except Exception as e:
            print(f"Error getting patients: {str(e)}")
            return False, f"Failed to get patients: {str(e)}", None
    
    def get_patient_by_id(self, patient_id: str) -> Tuple[bool, str, Optional[Patient]]:
        """Get patient by database ID"""
        try:
            result = self.supabase.table('patients').select('*').eq('id', patient_id).execute()
            
            if result.data and len(result.data) > 0:
                patient = Patient.from_dict(result.data[0])
                return True, "Patient found", patient
            else:
                return False, "Patient not found", None
                
        except Exception as e:
            print(f"Error getting patient by ID: {str(e)}")
            return False, f"Failed to get patient: {str(e)}", None
    
    def get_patient_by_medical_record_number(self, mrn: str) -> Tuple[bool, str, Optional[Patient]]:
        """Get patient by medical record number (Patient ID)"""
        try:
            result = self.supabase.table('patients').select('*').eq('medical_record_number', mrn).execute()
            
            if result.data and len(result.data) > 0:
                patient = Patient.from_dict(result.data[0])
                return True, "Patient found", patient
            else:
                return False, "Patient not found", None
                
        except Exception as e:
            print(f"Error getting patient by MRN: {str(e)}")
            return False, f"Failed to get patient: {str(e)}", None
    
    def update_patient(self, patient_id: str, patient_data: Dict[str, Any], updated_by: str) -> Tuple[bool, str, Optional[Patient]]:
        """Update patient information"""
        try:
            # Get existing patient
            success, message, existing_patient = self.get_patient_by_id(patient_id)
            if not success:
                return False, message, None
            
            # Create updated patient object
            updated_patient = Patient.from_dict(patient_data)
            updated_patient.id = patient_id
            updated_patient.created_by = existing_patient.created_by
            updated_patient.created_at = existing_patient.created_at
            
            # Validate updated data
            is_valid, validation_message = updated_patient.validate()
            if not is_valid:
                return False, validation_message, None
            
            # Check email uniqueness (exclude current patient)
            if updated_patient.email and self.email_exists(updated_patient.email, patient_id):
                return False, "Email address already exists for another patient", None
            
            # Prepare update data
            update_data = updated_patient.to_db_dict()
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            # Update patient in database
            result = self.supabase.table('patients').update(update_data).eq('id', patient_id).execute()
            
            if result.data and len(result.data) > 0:
                updated_data = result.data[0]
                updated_patient.updated_at = datetime.fromisoformat(updated_data.get('updated_at', '').replace('Z', '+00:00'))
                
                return True, "Patient updated successfully", updated_patient
            else:
                return False, "Failed to update patient", None
                
        except Exception as e:
            print(f"Patient update error: {str(e)}")
            return False, f"Update failed: {str(e)}", None
    
    def search_patients(self, search_term: str, created_by: str = None) -> Tuple[bool, str, Optional[List[Patient]]]:
        """Search patients by name, email, or medical record number"""
        try:
            # Get all patients first (Supabase doesn't support OR queries easily)
            success, message, all_patients = self.get_all_patients(created_by)
            if not success:
                return False, message, None
            
            if not all_patients:
                return True, "No patients found", []
            
            # Filter patients based on search term
            search_term_lower = search_term.lower()
            filtered_patients = []
            
            for patient in all_patients:
                # Search in name, email, and medical record number
                if (search_term_lower in patient.full_name.lower() or
                    (patient.email and search_term_lower in patient.email.lower()) or
                    (patient.medical_record_number and search_term_lower in patient.medical_record_number.lower())):
                    filtered_patients.append(patient)
            
            return True, f"Found {len(filtered_patients)} patients", filtered_patients
            
        except Exception as e:
            print(f"Patient search error: {str(e)}")
            return False, f"Search failed: {str(e)}", None