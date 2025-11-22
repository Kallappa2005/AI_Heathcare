# User model for healthcare platform
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class User:
    """User model representing healthcare professionals and administrators"""
    
    def __init__(self, 
                 email: str,
                 first_name: str,
                 last_name: str,
                 role: str,
                 password_hash: str = None,
                 specialization: str = None,
                 license_number: str = None,
                 department: str = None,
                 is_active: bool = True,
                 id: str = None,
                 created_at: datetime = None,
                 updated_at: datetime = None):
        
        self.id = id or str(uuid.uuid4())
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.role = role
        self.specialization = specialization
        self.license_number = license_number
        self.department = department
        self.is_active = is_active
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
    
    @property
    def full_name(self) -> str:
        """Get user's full name"""
        return f"{self.first_name} {self.last_name}"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert user object to dictionary (excluding password)"""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'role': self.role,
            'specialization': self.specialization,
            'license_number': self.license_number,
            'department': self.department,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def to_db_dict(self) -> Dict[str, Any]:
        """Convert user object to dictionary for database insertion"""
        return {
            'id': self.id,
            'email': self.email,
            'password_hash': self.password_hash,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'specialization': self.specialization,
            'license_number': self.license_number,
            'department': self.department,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        """Create User object from dictionary"""
        # Safe datetime parsing
        def parse_datetime(date_str):
            if not date_str:
                return None
            try:
                # Convert to string first
                date_str = str(date_str)
                # Handle different datetime formats
                if 'T' in date_str:
                    # ISO format with T - handle timezone
                    date_str = date_str.replace('Z', '+00:00')
                    if '+' not in date_str and date_str.endswith('00:00') == False:
                        date_str += '+00:00'
                    return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                else:
                    # Try to parse as ISO format
                    return datetime.fromisoformat(date_str)
            except (ValueError, TypeError) as e:
                # Return current time if parsing fails
                return datetime.utcnow()
        
        # Ensure data is a dictionary
        if not isinstance(data, dict):
            raise ValueError(f"Expected dict, got {type(data)}: {data}")
        
        try:
            return cls(
                id=data.get('id'),
                email=data['email'],
                password_hash=data.get('password_hash'),
                first_name=data['first_name'],
                last_name=data['last_name'],
                role=data.get('role', 'nurse'),  # Default to 'nurse' if role is missing
                specialization=data.get('specialization'),
                license_number=data.get('license_number'),
                department=data.get('department'),
                is_active=data.get('is_active', True),
                created_at=parse_datetime(data.get('created_at')),
                updated_at=parse_datetime(data.get('updated_at'))
            )
        except Exception as e:
            raise ValueError(f"Error creating User object: {e}")  # Re-raise as clear error
    
    def __str__(self) -> str:
        return f"User({self.email}, {self.role}, {self.full_name})"
    
    def __repr__(self) -> str:
        return self.__str__()