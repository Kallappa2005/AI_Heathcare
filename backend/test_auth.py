#!/usr/bin/env python3
"""
Test script to create users and test authentication
"""
import sys
import os
import requests
import json

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_registration():
    """Test user registration"""
    url = "http://localhost:5000/api/auth/register"
    
    # Test data for different user types
    test_users = [
        {
            "firstName": "Admin",
            "lastName": "User", 
            "email": "admin@hospital.com",
            "password": "admin123",
            "role": "admin",
            "department": "Administration"
        },
        {
            "firstName": "Dr. John",
            "lastName": "Doctor",
            "email": "doctor@hospital.com", 
            "password": "doctor123",
            "role": "doctor",
            "department": "Cardiology",
            "specialization": "Interventional Cardiology",
            "licenseNumber": "MD12345"
        },
        {
            "firstName": "Jane",
            "lastName": "Nurse",
            "email": "nurse@hospital.com",
            "password": "nurse123", 
            "role": "nurse",
            "department": "ICU",
            "specialization": "Critical Care",
            "licenseNumber": "RN54321"
        }
    ]
    
    for user_data in test_users:
        try:
            response = requests.post(url, json=user_data)
            print(f"\nRegistering {user_data['role']}: {user_data['email']}")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
        except Exception as e:
            print(f"Registration failed for {user_data['email']}: {str(e)}")

def test_login():
    """Test user login"""
    url = "http://localhost:5000/api/auth/login"
    
    # Test login credentials
    test_credentials = [
        {"email": "nurse@hospital.com", "password": "nurse123"}
    ]
    
    for creds in test_credentials:
        try:
            response = requests.post(url, json=creds)
            print(f"\nTesting login for: {creds['email']}")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
        except Exception as e:
            print(f"Login failed for {creds['email']}: {str(e)}")

def test_health():
    """Test auth health endpoint"""
    url = "http://localhost:5000/api/auth/health"
    
    try:
        response = requests.get(url)
        print(f"\nAuth health check:")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Health check failed: {str(e)}")

if __name__ == "__main__":
    print("Testing Healthcare Auth System")
    print("=" * 40)
    
    # Test health first
    test_health()
    
    # Test registration
    print("\n" + "=" * 40)
    print("Testing User Registration")
    test_registration()
    
    # Test login
    print("\n" + "=" * 40)  
    print("Testing User Login")
    test_login()