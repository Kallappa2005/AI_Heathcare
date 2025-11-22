#!/usr/bin/env python3

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def add_role_to_existing_users():
    """Add role column to existing users"""
    try:
        from app.utils.database import get_supabase_client
        
        supabase = get_supabase_client()
        
        print("=== Adding Role to Existing Users ===\n")
        
        # Get all users
        result = supabase.table('users').select('*').execute()
        
        print(f"Found {len(result.data)} users in database")
        
        for user in result.data:
            print(f"User: {user['email']} - Current role: {user.get('role', 'NULL')}")
            
            # If user doesn't have role, set it to nurse
            if not user.get('role'):
                update_result = supabase.table('users').update({'role': 'nurse'}).eq('id', user['id']).execute()
                if update_result.data:
                    print(f"  ✅ Updated {user['email']} to nurse role")
                else:
                    print(f"  ❌ Failed to update {user['email']}")
            else:
                print(f"  ✅ {user['email']} already has role: {user['role']}")
        
        print("\n=== Testing Login After Fix ===")
        
        # Test login
        from app.services.auth_service import AuthService
        auth_service = AuthService()
        
        success, message, result = auth_service.login_user('ritesh@gmail.com', '123456')
        
        print(f"Login test - Success: {success}")
        print(f"Message: {message}")
        
        if success and result:
            user_data = result.get('user', {})
            print(f"✅ Login successful!")
            print(f"  User: {user_data.get('full_name')}")
            print(f"  Role: {user_data.get('role')}")
            print(f"  Email: {user_data.get('email')}")
        
        return success
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        print(f"Full error: {traceback.format_exc()}")
        return False

if __name__ == "__main__":
    add_role_to_existing_users()