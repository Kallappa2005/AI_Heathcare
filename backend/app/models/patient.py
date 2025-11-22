# Patient model for healthcare management
from typing import Dict, Any, Optional
from datetime import datetime, date

class Patient:
    """Patient model representing a healthcare patient"""
    
    def __init__(self, 
                 patient_id: str = None,
                 first_name: str = None,
                 last_name: str = None,
                 email: str = None,
                 phone: str = None,
                 date_of_birth: date = None,
                 gender: str = None,
                 address: str = None,
                 emergency_contact_name: str = None,
                 emergency_contact_phone: str = None,
                 medical_history: str = None,
                 current_medications: str = None,
                 allergies: str = None,
                 insurance_provider: str = None,
                 insurance_number: str = None,
                 id: str = None,
                 medical_record_number: str = None,
                 created_at: datetime = None,
                 updated_at: datetime = None,
                 created_by: str = None):
        """Initialize Patient instance"""
        self.id = id
        self.patient_id = patient_id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone = phone
        self.date_of_birth = date_of_birth
        self.gender = gender
        self.address = address
        self.emergency_contact_name = emergency_contact_name
        self.emergency_contact_phone = emergency_contact_phone
        self.medical_record_number = medical_record_number or patient_id
        self.medical_history = medical_history
        self.current_medications = current_medications
        self.allergies = allergies
        self.insurance_provider = insurance_provider
        self.insurance_number = insurance_number
        self.created_at = created_at
        self.updated_at = updated_at
        self.created_by = created_by
    
    @property
    def full_name(self) -> str:
        """Get patient's full name"""
        return f"{self.first_name} {self.last_name}".strip()
    
    @property
    def age(self) -> Optional[int]:
        """Calculate patient's age from date of birth"""
        if not self.date_of_birth:
            return None
        
        today = date.today()
        
        # Handle string date format from database
        if isinstance(self.date_of_birth, str):
            try:
                dob = datetime.strptime(self.date_of_birth, '%Y-%m-%d').date()
            except ValueError:
                return None
        else:
            dob = self.date_of_birth
        
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert Patient instance to dictionary"""
        return {
            'id': self.id,
            'patientId': self.medical_record_number,  # Use medical_record_number as patientId for frontend
            'firstName': self.first_name,
            'lastName': self.last_name,
            'fullName': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'dateOfBirth': self.date_of_birth.isoformat() if isinstance(self.date_of_birth, date) else self.date_of_birth,
            'age': self.age,
            'gender': self.gender,
            'address': self.address,
            'emergencyContactName': self.emergency_contact_name,
            'emergencyContactPhone': self.emergency_contact_phone,
            'medicalRecordNumber': self.medical_record_number,
            'medicalHistory': self.medical_history,
            'currentMedications': self.current_medications,
            'allergies': self.allergies,
            'insuranceProvider': self.insurance_provider,
            'insuranceNumber': self.insurance_number,
            'createdAt': self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at,
            'updatedAt': self.updated_at.isoformat() if isinstance(self.updated_at, datetime) else self.updated_at,
            'createdBy': self.created_by
        }
    
    def to_db_dict(self) -> Dict[str, Any]:
        """Convert Patient instance to database format"""
        return {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth.isoformat() if isinstance(self.date_of_birth, date) else self.date_of_birth,
            'gender': self.gender,
            'address': self.address,
            'emergency_contact_name': self.emergency_contact_name,
            'emergency_contact_phone': self.emergency_contact_phone,
            'medical_record_number': self.medical_record_number,
            'medical_history': self.medical_history,
            'current_medications': self.current_medications,
            'allergies': self.allergies,
            'insurance_provider': self.insurance_provider,
            'insurance_number': self.insurance_number,
            'created_by': self.created_by
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Patient':
        """Create Patient instance from dictionary"""
        # Handle both frontend camelCase and database snake_case
        patient = cls()
        
        # Map frontend camelCase to Patient attributes
        patient.id = data.get('id')
        patient.patient_id = data.get('patientId') or data.get('patient_id')
        patient.first_name = data.get('firstName') or data.get('first_name')
        patient.last_name = data.get('lastName') or data.get('last_name')
        patient.email = data.get('email')
        patient.phone = data.get('phone')
        
        # Handle date of birth
        dob = data.get('dateOfBirth') or data.get('date_of_birth')
        if dob and isinstance(dob, str):
            try:
                patient.date_of_birth = datetime.strptime(dob, '%Y-%m-%d').date()
            except ValueError:
                patient.date_of_birth = None
        elif isinstance(dob, date):
            patient.date_of_birth = dob
        
        patient.gender = data.get('gender')
        patient.address = data.get('address')
        patient.emergency_contact_name = data.get('emergencyContact') or data.get('emergency_contact_name')
        patient.emergency_contact_phone = data.get('emergencyPhone') or data.get('emergency_contact_phone')
        patient.medical_record_number = data.get('medicalRecordNumber') or data.get('medical_record_number')
        patient.medical_history = data.get('medicalHistory') or data.get('medical_history')
        patient.current_medications = data.get('currentMedications') or data.get('current_medications')
        patient.allergies = data.get('allergies')
        patient.insurance_provider = data.get('insuranceProvider') or data.get('insurance_provider')
        patient.insurance_number = data.get('insuranceNumber') or data.get('insurance_number')
        patient.created_by = data.get('createdBy') or data.get('created_by')
        
        # Handle timestamps
        created_at = data.get('createdAt') or data.get('created_at')
        if created_at and isinstance(created_at, str):
            try:
                patient.created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            except ValueError:
                patient.created_at = None
        elif isinstance(created_at, datetime):
            patient.created_at = created_at
        
        updated_at = data.get('updatedAt') or data.get('updated_at')
        if updated_at and isinstance(updated_at, str):
            try:
                patient.updated_at = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
            except ValueError:
                patient.updated_at = None
        elif isinstance(updated_at, datetime):
            patient.updated_at = updated_at
        
        return patient
    
    def validate(self) -> tuple[bool, str]:
        """Validate patient data"""
        if not self.first_name or not self.first_name.strip():
            return False, "First name is required"
        
        if not self.last_name or not self.last_name.strip():
            return False, "Last name is required"
        
        if not self.phone or not self.phone.strip():
            return False, "Phone number is required"
        
        if self.email and '@' not in self.email:
            return False, "Valid email address is required"
        
        if not self.date_of_birth:
            return False, "Date of birth is required"
        
        if not self.gender or not self.gender.strip():
            return False, "Gender is required"
        
        if not self.emergency_contact_name or not self.emergency_contact_name.strip():
            return False, "Emergency contact name is required"
        
        if not self.emergency_contact_phone or not self.emergency_contact_phone.strip():
            return False, "Emergency contact phone is required"
        
        return True, "Valid"