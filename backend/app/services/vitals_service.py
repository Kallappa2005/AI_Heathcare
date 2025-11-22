# Vitals service for managing patient vital signs
from app.utils.database import get_supabase_client
import uuid
from datetime import datetime, timezone

class VitalsService:
    """Service class for vital signs operations"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
    
# Vitals service for managing patient vital signs
from app.utils.database import get_supabase_client
import uuid
from datetime import datetime, timezone

class VitalsService:
    """Service class for vital signs operations"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
    
    def create_vital_upload(self, vital_data, uploaded_by):
        """Upload new vital signs for a patient"""
        try:
            print(f"=== DEBUG: create_vital_upload called with vital_data={vital_data}, uploaded_by={uploaded_by}")
            
            # Validate required fields
            required_fields = ['patient_id', 'heart_rate', 'blood_pressure_systolic', 
                             'blood_pressure_diastolic', 'temperature', 'respiratory_rate', 
                             'oxygen_saturation']
            
            print(f"=== DEBUG: Checking required fields: {required_fields}")
            for field in required_fields:
                if field not in vital_data or vital_data[field] is None:
                    print(f"=== DEBUG: Missing required field: {field}")
                    return False, f'Missing required field: {field}', None
            
            print("=== DEBUG: All required fields present")
            
            # Generate ID
            vital_id = str(uuid.uuid4())
            current_time = datetime.now(timezone.utc)
            
            # Prepare data for Supabase
            insert_data = {
                'id': vital_id,
                'patient_id': vital_data.get('patient_id'),
                'heart_rate': int(vital_data.get('heart_rate')),
                'blood_pressure_systolic': int(vital_data.get('blood_pressure_systolic')),
                'blood_pressure_diastolic': int(vital_data.get('blood_pressure_diastolic')),
                'temperature': float(vital_data.get('temperature')),
                'respiratory_rate': int(vital_data.get('respiratory_rate')),
                'oxygen_saturation': float(vital_data.get('oxygen_saturation')),
                'notes': vital_data.get('notes', ''),
                'recorded_at': vital_data.get('recorded_at', current_time.isoformat()),
                'uploaded_by': uploaded_by
            }
            
            print(f"=== DEBUG: Prepared insert_data: {insert_data}")
            
            # Insert into Supabase
            print("=== DEBUG: Inserting into Supabase...")
            result = self.supabase.table('vital_uploads').insert(insert_data).execute()
            print(f"=== DEBUG: Supabase result: {result}")
            
            if result.data:
                print(f"=== DEBUG: Insert successful: {result.data}")
                return True, 'Vital signs uploaded successfully', vital_id
            else:
                print(f"=== DEBUG: Insert failed - no data returned")
                return False, 'Failed to upload vital signs', None
            
        except Exception as e:
            print(f"=== DEBUG: Exception in create_vital_upload: {str(e)}")
            import traceback
            traceback.print_exc()
            return False, f'Failed to upload vital signs: {str(e)}', None
    
    def get_patient_vitals(self, patient_id, limit=10):
        """Get vital signs for a specific patient"""
        try:
            print(f"=== DEBUG: Getting vitals for patient {patient_id} with limit={limit} ===")
            
            # Get vitals for specific patient
            query = self.supabase.table('vital_uploads')\
                .select('*')\
                .eq('patient_id', patient_id)\
                .order('recorded_at', desc=True)
            
            if limit:
                query = query.limit(limit)
            
            vitals_result = query.execute()
            
            print(f"=== DEBUG: Found {len(vitals_result.data or [])} vitals for patient ===")
            
            if not vitals_result.data:
                return True, 'No vitals found for patient', []
            
            # Get patient information
            patient_result = self.supabase.table('patients')\
                .select('id, first_name, last_name, medical_record_number')\
                .eq('id', patient_id)\
                .execute()
            
            patient_info = {}
            if patient_result.data:
                patient_data = patient_result.data[0]
                patient_info = {
                    'first_name': patient_data.get('first_name', ''),
                    'last_name': patient_data.get('last_name', ''),
                    'medical_record_number': patient_data.get('medical_record_number', '')
                }
            
            patient_name = f"{patient_info.get('first_name', '')} {patient_info.get('last_name', '')}".strip()
            
            # Format results
            vitals = []
            for row in vitals_result.data:
                vitals.append({
                    'id': row.get('id'),
                    'patient_id': row.get('patient_id'),
                    'patient_name': patient_name or 'Unknown Patient',
                    'patient_code': patient_info.get('medical_record_number', ''),
                    'heart_rate': row.get('heart_rate'),
                    'blood_pressure_systolic': row.get('blood_pressure_systolic'),
                    'blood_pressure_diastolic': row.get('blood_pressure_diastolic'),
                    'temperature': row.get('temperature'),
                    'respiratory_rate': row.get('respiratory_rate'),
                    'oxygen_saturation': row.get('oxygen_saturation'),
                    'notes': row.get('notes', ''),
                    'recorded_at': row.get('recorded_at'),
                    'uploaded_at': row.get('uploaded_at'),
                    'uploaded_by': row.get('uploaded_by')
                })
            
            print(f"=== DEBUG: Formatted {len(vitals)} vitals for patient ===")
            return True, 'Vitals retrieved successfully', vitals
            
        except Exception as e:
            print(f"=== DEBUG: Exception in get_patient_vitals: {str(e)}")
            import traceback
            traceback.print_exc()
            return True, 'No vitals found (error occurred)', []
    
    def get_recent_vitals(self, limit=20):
        """Get recent vital signs across all patients"""
        try:
            print(f"=== DEBUG: Getting recent vitals with limit={limit} ===")
            
            # First get the vitals data
            vitals_result = self.supabase.table('vital_uploads')\
                .select('*')\
                .order('uploaded_at', desc=True)\
                .limit(limit)\
                .execute()
            
            print(f"=== DEBUG: Found {len(vitals_result.data or [])} vital records ===")
            
            if not vitals_result.data:
                return True, 'No vitals found', []
            
            # Get all unique patient IDs
            patient_ids = list(set(row['patient_id'] for row in vitals_result.data))
            print(f"=== DEBUG: Unique patient IDs: {patient_ids} ===")
            
            # Fetch patient information
            patients_result = self.supabase.table('patients')\
                .select('id, first_name, last_name, medical_record_number')\
                .in_('id', patient_ids)\
                .execute()
            
            print(f"=== DEBUG: Found {len(patients_result.data or [])} patient records ===")
            
            # Create patient lookup
            patients_lookup = {}
            for patient in patients_result.data or []:
                patients_lookup[patient['id']] = {
                    'first_name': patient.get('first_name', ''),
                    'last_name': patient.get('last_name', ''),
                    'medical_record_number': patient.get('medical_record_number', '')
                }
            
            # Format results
            vitals = []
            for row in vitals_result.data:
                patient_info = patients_lookup.get(row['patient_id'], {})
                patient_name = f"{patient_info.get('first_name', '')} {patient_info.get('last_name', '')}".strip()
                
                vitals.append({
                    'id': row.get('id'),
                    'patient_id': row.get('patient_id'),
                    'patient_name': patient_name or 'Unknown Patient',
                    'patient_code': patient_info.get('medical_record_number', ''),
                    'heart_rate': row.get('heart_rate'),
                    'blood_pressure_systolic': row.get('blood_pressure_systolic'),
                    'blood_pressure_diastolic': row.get('blood_pressure_diastolic'),
                    'temperature': row.get('temperature'),
                    'respiratory_rate': row.get('respiratory_rate'),
                    'oxygen_saturation': row.get('oxygen_saturation'),
                    'notes': row.get('notes', ''),
                    'recorded_at': row.get('recorded_at'),
                    'uploaded_at': row.get('uploaded_at'),
                    'uploaded_by': row.get('uploaded_by')
                })
            
            print(f"=== DEBUG: Formatted {len(vitals)} vitals records ===")
            return True, 'Recent vitals retrieved successfully', vitals
            
        except Exception as e:
            print(f"=== DEBUG: Exception in get_recent_vitals: {str(e)}")
            import traceback
            traceback.print_exc()
            # Return empty list if there's an error
            return True, 'No vitals found (error occurred)', []
    
    def update_vital_record(self, vital_id, vital_data):
        """Update an existing vital signs record"""
        try:
            update_data = {
                'heart_rate': int(vital_data.get('heart_rate')),
                'blood_pressure_systolic': int(vital_data.get('blood_pressure_systolic')),
                'blood_pressure_diastolic': int(vital_data.get('blood_pressure_diastolic')),
                'temperature': float(vital_data.get('temperature')),
                'respiratory_rate': int(vital_data.get('respiratory_rate')),
                'oxygen_saturation': float(vital_data.get('oxygen_saturation')),
                'notes': vital_data.get('notes', '')
            }
            
            result = self.supabase.table('vital_uploads')\
                .update(update_data)\
                .eq('id', vital_id)\
                .execute()
            
            if result.data:
                return True, 'Vital record updated successfully'
            else:
                return False, 'Failed to update vital record'
            
        except Exception as e:
            return False, f'Failed to update vital record: {str(e)}'
    
    def delete_vital_record(self, vital_id):
        """Delete a vital signs record"""
        try:
            result = self.supabase.table('vital_uploads')\
                .delete()\
                .eq('id', vital_id)\
                .execute()
            
            if result.data:
                return True, 'Vital record deleted successfully'
            else:
                return False, 'Failed to delete vital record'
            
        except Exception as e:
            return False, f'Failed to delete vital record: {str(e)}'