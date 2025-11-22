#!/usr/bin/env python3

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_user_exists():
    """Test if users exist in the database"""
    print("Testing user existence...")
    
    try:
        from app.services.auth_service import AuthService
        
        auth_service = AuthService()
        
        # Check if nurse user exists
        exists = auth_service.user_exists('nurse@hospital.com')
        print(f"Nurse user exists: {exists}")
        
        # Get user data directly from database
        result = auth_service.supabase.table('users').select('*').eq('email', 'nurse@hospital.com').execute()
        print(f"Database query result: {result.data}")
        
        if result.data:
            user_data = result.data[0]
            print(f"User data type: {type(user_data)}")
            print(f"User data keys: {user_data.keys() if isinstance(user_data, dict) else 'Not a dict'}")
            
            # Try to create User object
            from app.models.user import User
            try:
                user = User.from_dict(user_data)
                print(f"User object created successfully: {user}")
                return True
            except Exception as e:
                print(f"Error creating User object: {str(e)}")
                print(f"User data: {user_data}")
                return False
        else:
            print("No user data found")
            return False
            
    except Exception as e:
        print(f"Database query error: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return False

def test_login_service():
    """Test the login service directly"""
    print("\nTesting login service...")
    
    try:
        from app.services.auth_service import AuthService
        
        auth_service = AuthService()
        
        # Test login
        success, message, result = auth_service.login_user('nurse@hospital.com', 'nurse123')
        
        print(f"Login success: {success}")
        print(f"Login message: {message}")
        print(f"Login result: {result}")
        
        return success
    except Exception as e:
        print(f"Login service error: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return False

def main():
    """Run all tests"""
    print("=== Authentication Debugging ===\n")
    
    # Test 1: Check if users exist and can be loaded
    if not test_user_exists():
        print("\n❌ User existence test failed!")
        return
    
    print("\n✅ User existence test passed!")
    
    # Test 2: Test login service directly
    if not test_login_service():
        print("\n❌ Login service test failed!")
        return
        
    print("\n✅ Login service test passed!")

if __name__ == "__main__":
    main()