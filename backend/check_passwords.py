#!/usr/bin/env python3

import sys
import os
import bcrypt

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_existing_users():
    """Check existing users and their password hashes"""
    try:
        from app.services.auth_service import AuthService
        
        auth_service = AuthService()
        
        # Get all users from database
        result = auth_service.supabase.table('users').select('email, password_hash, first_name, last_name').execute()
        
        print("=== Existing Users in Database ===")
        for user in result.data:
            print(f"Email: {user['email']}")
            print(f"Name: {user['first_name']} {user['last_name']}")
            print(f"Password Hash: {user['password_hash']}")
            print("-" * 50)
            
        return result.data
        
    except Exception as e:
        print(f"Error getting users: {e}")
        return []

def test_common_passwords(email, password_hash):
    """Test common passwords against a hash"""
    
    # Common passwords that might have been used
    test_passwords = [
        "123456",
        "password", 
        "admin",
        "admin123",
        "nurse123",
        "doctor123",
        "KALLAPPA",
        "kallappa",
        "Kallappa",
        "KABBOOR", 
        "kabboor",
        "Kabboor",
        "123",
        "1234",
        "12345",
        "",  # empty password
        email.split('@')[0],  # username as password
    ]
    
    print(f"\nTesting passwords for {email}:")
    
    for password in test_passwords:
        try:
            if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                print(f"✅ Found password: '{password}'")
                return password
        except Exception as e:
            pass
    
    print("❌ No common password found")
    return None

def main():
    print("=== Checking Your Database Users ===\n")
    
    users = check_existing_users()
    
    if not users:
        print("No users found in database")
        return
    
    print("\n=== Testing Passwords ===")
    for user in users:
        found_password = test_common_passwords(user['email'], user['password_hash'])
        if found_password:
            print(f"✅ User {user['email']} can login with password: '{found_password}'")
        else:
            print(f"❌ Could not determine password for {user['email']}")

if __name__ == "__main__":
    main()