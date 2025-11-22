#!/usr/bin/env python3

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def register_nurse():
    """Register a nurse user through the API"""
    try:
        from app.services.auth_service import AuthService
        
        auth_service = AuthService()
        
        # Check if nurse already exists
        if auth_service.user_exists('testnurse@hospital.com'):
            print("Test nurse already exists, skipping registration...")
            return True
        
        # Register nurse
        user_data = {
            'email': 'testnurse@hospital.com',
            'password': 'nurse123',
            'firstName': 'Test',
            'lastName': 'Nurse',
            'role': 'nurse',
            'department': 'Emergency'
        }
        
        success, message, user = auth_service.register_user(user_data)
        print(f"Registration - Success: {success}, Message: {message}")
        
        if success:
            print(f"User created: {user}")
            return True
        else:
            print(f"Registration failed: {message}")
            return False
            
    except Exception as e:
        print(f"Registration error: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return False

def test_database_user():
    """Test fetching and parsing a user from the database"""
    try:
        from app.services.auth_service import AuthService
        from app.models.user import User
        
        auth_service = AuthService()
        
        # Get user data directly from database  
        result = auth_service.supabase.table('users').select('*').eq('email', 'testnurse@hospital.com').execute()
        
        if not result.data:
            print("No user found in database")
            return False
            
        print(f"Raw database result: {result}")
        print(f"Database data: {result.data}")
        
        user_data = result.data[0]
        print(f"User data type: {type(user_data)}")
        print(f"User data: {user_data}")
        
        # Check each field type
        for key, value in user_data.items():
            print(f"{key}: {type(value)} = {value}")
        
        # Try to create user object
        print("\nTrying to create User object...")
        user = User.from_dict(user_data)
        print(f"User object created successfully: {user}")
        
        return True
        
    except Exception as e:
        print(f"Database test error: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return False

def test_login():
    """Test login with proper error handling"""
    try:
        from app.services.auth_service import AuthService
        
        auth_service = AuthService()
        
        print("Testing login...")
        success, message, result = auth_service.login_user('testnurse@hospital.com', 'nurse123')
        
        print(f"Login success: {success}")
        print(f"Login message: {message}")
        print(f"Login result type: {type(result)}")
        print(f"Login result: {result}")
        
        return success
        
    except Exception as e:
        print(f"Login test error: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return False

def main():
    print("=== Fixing and Testing Authentication ===\n")
    
    # Step 1: Register a test nurse
    print("1. Registering test nurse...")
    if not register_nurse():
        print("Failed to register nurse, stopping...")
        return
    
    # Step 2: Test database user fetching
    print("\n2. Testing database user fetching...")
    if not test_database_user():
        print("Failed to fetch user from database, stopping...")
        return
        
    # Step 3: Test login
    print("\n3. Testing login...")
    if test_login():
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Login test failed!")

if __name__ == "__main__":
    main()