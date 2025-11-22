# Staff model for healthcare staff management
from typing import Dict, Any, Optional
from datetime import datetime, date

class Staff:
    """Staff model representing a healthcare staff member"""
    
    def __init__(self, 
                 employee_id: str = None,
                 first_name: str = None,
                 last_name: str = None,
                 email: str = None,
                 phone: str = None,
                 role: str = None,
                 department: str = None,
                 specialization: str = None,
                 license_number: str = None,
                 date_of_joining: date = None,
                 address: str = None,
                 emergency_contact_name: str = None,
                 emergency_contact_phone: str = None,
                 status: str = 'Active',
                 patients_assigned: int = 0,
                 id: str = None,
                 created_at: datetime = None,
                 updated_at: datetime = None,
                 created_by: str = None):
        """Initialize Staff instance"""
        self.id = id
        self.employee_id = employee_id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone = phone
        self.role = role
        self.department = department
        self.specialization = specialization
        self.license_number = license_number
        self.date_of_joining = date_of_joining
        self.address = address
        self.emergency_contact_name = emergency_contact_name
        self.emergency_contact_phone = emergency_contact_phone
        self.status = status
        self.patients_assigned = patients_assigned
        self.created_at = created_at
        self.updated_at = updated_at
        self.created_by = created_by
    
    @property
    def full_name(self) -> str:
        """Get staff member's full name"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert Staff instance to dictionary"""
        return {
            'id': self.id,
            'employeeId': self.employee_id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'fullName': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'department': self.department,
            'specialization': self.specialization,
            'licenseNumber': self.license_number,
            'dateOfJoining': self.date_of_joining.isoformat() if isinstance(self.date_of_joining, date) else self.date_of_joining,
            'address': self.address,
            'emergencyContactName': self.emergency_contact_name,
            'emergencyContactPhone': self.emergency_contact_phone,
            'status': self.status,
            'patientsAssigned': self.patients_assigned,
            'createdAt': self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at,
            'updatedAt': self.updated_at.isoformat() if isinstance(self.updated_at, datetime) else self.updated_at,
            'createdBy': self.created_by
        }
    
    def to_db_dict(self) -> Dict[str, Any]:
        """Convert Staff instance to database format"""
        db_dict = {
            'employee_id': self.employee_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'department': self.department,
            'specialization': self.specialization,
            'license_number': self.license_number,
            'date_of_joining': self.date_of_joining.isoformat() if isinstance(self.date_of_joining, date) else self.date_of_joining,
            'address': self.address,
            'emergency_contact_name': self.emergency_contact_name,
            'emergency_contact_phone': self.emergency_contact_phone,
            'status': self.status,
            'patients_assigned': self.patients_assigned
        }
        
        # Only include created_by if it's not None to avoid foreign key issues
        if self.created_by:
            db_dict['created_by'] = self.created_by
            
        return db_dict
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Staff':
        """Create Staff instance from dictionary"""
        staff = cls()
        
        # Map frontend camelCase to Staff attributes
        staff.id = data.get('id')
        staff.employee_id = data.get('employeeId') or data.get('employee_id')
        staff.first_name = data.get('firstName') or data.get('first_name')
        staff.last_name = data.get('lastName') or data.get('last_name')
        staff.email = data.get('email')
        staff.phone = data.get('phone')
        staff.role = data.get('role')
        staff.department = data.get('department')
        staff.specialization = data.get('specialization')
        staff.license_number = data.get('licenseNumber') or data.get('license_number')
        staff.address = data.get('address')
        staff.emergency_contact_name = data.get('emergencyContact') or data.get('emergency_contact_name')
        staff.emergency_contact_phone = data.get('emergencyPhone') or data.get('emergency_contact_phone')
        staff.status = data.get('status', 'Active')
        staff.patients_assigned = data.get('patientsAssigned') or data.get('patients_assigned', 0)
        staff.created_by = data.get('createdBy') or data.get('created_by')
        
        # Handle date of joining
        doj = data.get('dateOfJoining') or data.get('date_of_joining')
        if doj and isinstance(doj, str):
            try:
                staff.date_of_joining = datetime.strptime(doj, '%Y-%m-%d').date()
            except ValueError:
                staff.date_of_joining = None
        elif isinstance(doj, date):
            staff.date_of_joining = doj
        
        # Handle timestamps
        created_at = data.get('createdAt') or data.get('created_at')
        if created_at and isinstance(created_at, str):
            try:
                staff.created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            except ValueError:
                staff.created_at = None
        elif isinstance(created_at, datetime):
            staff.created_at = created_at
        
        updated_at = data.get('updatedAt') or data.get('updated_at')
        if updated_at and isinstance(updated_at, str):
            try:
                staff.updated_at = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
            except ValueError:
                staff.updated_at = None
        elif isinstance(updated_at, datetime):
            staff.updated_at = updated_at
        
        return staff
    
    def validate(self) -> tuple[bool, str]:
        """Validate staff data"""
        if not self.first_name or not self.first_name.strip():
            return False, "First name is required"
        
        if not self.last_name or not self.last_name.strip():
            return False, "Last name is required"
        
        if not self.email or '@' not in self.email:
            return False, "Valid email address is required"
        
        if not self.phone or not self.phone.strip():
            return False, "Phone number is required"
        
        if not self.role or not self.role.strip():
            return False, "Role is required"
        
        if self.role not in ['Doctor', 'Nurse', 'Admin', 'Technician']:
            return False, "Role must be one of: Doctor, Nurse, Admin, Technician"
        
        if not self.department or not self.department.strip():
            return False, "Department is required"
        
        if not self.employee_id or not self.employee_id.strip():
            return False, "Employee ID is required"
        
        if not self.date_of_joining:
            return False, "Date of joining is required"
        
        if self.status not in ['Active', 'Inactive', 'On Leave']:
            return False, "Status must be one of: Active, Inactive, On Leave"
        
        return True, "Valid"