#!/usr/bin/env python3

import requests
import json

def test_nurse_login():
    """Test nurse login via API"""
    
    # First register a test nurse
    print("=== Registering Test Nurse ===")
    register_url = "http://localhost:5000/api/auth/register"
    register_data = {
        "firstName": "Test",
        "lastName": "Nurse", 
        "email": "testnurse@hospital.com",
        "password": "nurse123",
        "role": "nurse",
        "department": "Emergency"
    }
    
    try:
        response = requests.post(register_url, json=register_data, timeout=10)
        print(f"Registration Status: {response.status_code}")
        print(f"Registration Response: {response.text}")
    except Exception as e:
        print(f"Registration failed: {e}")
    
    # Then test login
    print("\n=== Testing Login ===")
    login_url = "http://localhost:5000/api/auth/login"
    login_data = {
        "email": "testnurse@hospital.com",
        "password": "nurse123"
    }
    
    try:
        response = requests.post(login_url, json=login_data, timeout=10)
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful!")
            print(f"User: {data.get('user', {}).get('full_name')}")
            print(f"Role: {data.get('user', {}).get('role')}")
            print(f"Token: {data.get('token', '')[:50]}...")
            return True
        else:
            print(f"❌ Login failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"Login request failed: {e}")
        return False

def test_existing_users():
    """Test login with existing users from database"""
    print("\n=== Testing Existing Users ===")
    
    # Try users that should exist in the database
    test_users = [
        {"email": "ritesh@gmail.com", "password": "nurse123"},
        {"email": "kallappakaabour874@gmail.com", "password": "nurse123"}, 
        {"email": "ram@gmail.com", "password": "nurse123"},
        {"email": "niranjan@gmail.com", "password": "nurse123"}
    ]
    
    login_url = "http://localhost:5000/api/auth/login"
    
    for user in test_users:
        print(f"\nTesting login for: {user['email']}")
        try:
            response = requests.post(login_url, json=user, timeout=10)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Login successful for {user['email']}!")
                return True
                
        except Exception as e:
            print(f"Login failed for {user['email']}: {e}")
    
    return False

if __name__ == "__main__":
    print("Testing Healthcare Authentication API")
    print("=" * 50)
    
    # Test with new nurse
    test_nurse_login()
    
    # Test with existing users
    test_existing_users()