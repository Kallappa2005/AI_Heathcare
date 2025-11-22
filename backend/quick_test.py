#!/usr/bin/env python3

import requests
import json

def test_login_endpoint():
    """Test the login endpoint and show exact error"""
    
    url = "http://localhost:5000/api/auth/login"
    data = {
        "email": "kallappakabbur874@gmail.com",
        "password": "123456"
    }
    
    print("Testing login endpoint...")
    print(f"URL: {url}")
    print(f"Data: {data}")
    
    try:
        response = requests.post(url, json=data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS!")
            print(f"User: {result.get('user', {}).get('full_name')}")
            print(f"Token: {result.get('token', '')[:50]}...")
        else:
            print("❌ FAILED!")
            try:
                error_data = response.json()
                print(f"Error: {error_data}")
            except:
                print(f"Raw error: {response.text}")
                
    except requests.ConnectionError:
        print("❌ CONNECTION ERROR - Is the server running?")
    except requests.Timeout:
        print("❌ TIMEOUT ERROR")
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {e}")

if __name__ == "__main__":
    test_login_endpoint()