#!/usr/bin/env python3

import requests
import json

def register_nurse_user():
    """Register a nurse user that you can use for login testing"""
    
    register_url = "http://localhost:5000/api/auth/register"
    
    nurse_user = {
        "firstName": "Jane",
        "lastName": "Nurse", 
        "email": "nurse@hospital.com",
        "password": "nurse123",
        "role": "nurse",
        "department": "ICU",
        "specialization": "Critical Care",
        "licenseNumber": "RN12345"
    }
    
    try:
        response = requests.post(register_url, json=nurse_user, timeout=10)
        print(f"Registration Status: {response.status_code}")
        print(f"Registration Response: {response.text}")
        
        if response.status_code in [200, 201]:
            print("✅ Nurse user registered successfully!")
            return True
        elif response.status_code == 400 and "already exists" in response.text:
            print("✅ Nurse user already exists!")
            return True
        else:
            print("❌ Registration failed!")
            return False
            
    except Exception as e:
        print(f"Registration failed: {e}")
        return False

def test_nurse_login():
    """Test login with the nurse user"""
    
    login_url = "http://localhost:5000/api/auth/login"
    login_data = {
        "email": "nurse@hospital.com",
        "password": "nurse123"
    }
    
    try:
        response = requests.post(login_url, json=login_data, timeout=10)
        print(f"\nLogin Status: {response.status_code}")
        print(f"Login Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful!")
            print(f"User: {data.get('user', {}).get('full_name')}")
            print(f"Role: {data.get('user', {}).get('role')}")
            print(f"Email: {data.get('user', {}).get('email')}")
            return True
        else:
            print(f"❌ Login failed!")
            return False
            
    except Exception as e:
        print(f"Login request failed: {e}")
        return False

if __name__ == "__main__":
    print("=== Setting up Nurse User for Testing ===")
    
    # Register the nurse user
    if register_nurse_user():
        # Test login
        test_nurse_login()
        
        print("\n" + "=" * 50)
        print("✅ Setup complete!")
        print("You can now login with:")
        print("Email: nurse@hospital.com")
        print("Password: nurse123")
        print("=" * 50)