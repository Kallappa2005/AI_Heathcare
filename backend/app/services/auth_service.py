# Authentication service for user registration and login
import bcrypt
from typing import Optional, Dict, Any, Tuple
from app.models.user import User
from app.utils.database import get_supabase_client
import re

class AuthService:
    """Service class for authentication operations"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
    
    def validate_email(self, email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def validate_password(self, password: str) -> Tuple[bool, str]:
        """Validate password strength"""
        if len(password) < 6:
            return False, "Password must be at least 6 characters long"
        
        # You can add more password requirements here
        # if not re.search(r'[A-Z]', password):
        #     return False, "Password must contain at least one uppercase letter"
        
        return True, "Password is valid"
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
        return password_hash.decode('utf-8')
    
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    
    def user_exists(self, email: str) -> bool:
        """Check if user exists by email"""
        try:
            result = self.supabase.table('users').select('id').eq('email', email).execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"Error checking user existence: {str(e)}")
            return False
    
    def register_user(self, user_data: Dict[str, Any]) -> Tuple[bool, str, Optional[User]]:
        """Register a new user"""
        try:
            # Extract required fields
            email = user_data.get('email', '').lower().strip()
            password = user_data.get('password', '')
            first_name = user_data.get('firstName', '').strip()
            last_name = user_data.get('lastName', '').strip()
            role = user_data.get('role', '').lower()
            
            # Validate required fields
            if not all([email, password, first_name, last_name, role]):
                return False, "All required fields must be provided", None
            
            # Validate email
            if not self.validate_email(email):
                return False, "Invalid email format", None
            
            # Validate password
            is_valid, password_message = self.validate_password(password)
            if not is_valid:
                return False, password_message, None
            
            # Validate role
            valid_roles = ['admin', 'doctor', 'nurse']
            if role not in valid_roles:
                return False, f"Role must be one of: {', '.join(valid_roles)}", None
            
            # Check if user already exists
            if self.user_exists(email):
                return False, "User with this email already exists", None
            
            # Hash password
            password_hash = self.hash_password(password)
            
            # Create user object
            user = User(
                email=email,
                password_hash=password_hash,
                first_name=first_name,
                last_name=last_name,
                role=role,
                specialization=user_data.get('specialization'),
                license_number=user_data.get('licenseNumber'),
                department=user_data.get('department')
            )
            
            # Insert user into database
            db_data = user.to_db_dict()
            result = self.supabase.table('users').insert(db_data).execute()
            
            if result.data and len(result.data) > 0:
                return True, "User registered successfully", user
            else:
                return False, "Failed to register user", None
                
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return False, f"Registration failed: {str(e)}", None
    
    def login_user(self, email: str, password: str) -> Tuple[bool, str, Optional[User]]:
        """Login user and return user object (token creation handled in route)"""
        try:
            # Validate input
            if not email or not password:
                return False, "Email and password are required", None
            
            email = email.lower().strip()
            
            # Get user from database
            result = self.supabase.table('users').select('*').eq('email', email).execute()
            
            if not result.data or len(result.data) == 0:
                return False, "Invalid email or password", None
            
            user_data = result.data[0]
            
            # Ensure user_data is a dictionary
            if not isinstance(user_data, dict):
                return False, "Invalid user data format", None
            
            # Check if user is active
            if not user_data.get('is_active', True):
                return False, "Account is deactivated", None
            
            # Verify password
            password_hash = user_data.get('password_hash')
            if not password_hash:
                return False, "Account setup incomplete", None
                
            if not self.verify_password(password, password_hash):
                return False, "Invalid email or password", None
            
            # Create user object with error handling
            try:
                user = User.from_dict(user_data)
                return True, "Login successful", user
            except Exception as user_error:
                return False, f"User data processing error: {str(user_error)}", None
            
        except Exception as e:
            return False, f"Login failed: {str(e)}", None
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        try:
            result = self.supabase.table('users').select('*').eq('id', user_id).execute()
            
            if result.data and len(result.data) > 0:
                return User.from_dict(result.data[0])
            
            return None
            
        except Exception as e:
            print(f"Error getting user by ID: {str(e)}")
            return None