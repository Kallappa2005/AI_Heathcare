# Backend Setup Test Script
import sys
import os
import importlib.util

def test_imports():
    """Test if all required modules can be imported"""
    required_modules = [
        'flask',
        'supabase',
        'flask_jwt_extended',
        'flask_cors',
        'bcrypt',
        'python_dotenv',
        'pandas',
        'scikit_learn',
        'datetime'
    ]
    
    print("Testing Python module imports...")
    for module in required_modules:
        try:
            __import__(module)
            print(f"✓ {module}")
        except ImportError:
            print(f"✗ {module} - NOT FOUND")
            return False
    return True

def test_env_file():
    """Test if .env file exists and has required variables"""
    env_path = '.env'
    if not os.path.exists(env_path):
        print("✗ .env file not found")
        return False
    
    print("✓ .env file exists")
    
    required_vars = [
        'SUPABASE_URL',
        'SUPABASE_KEY',
        'JWT_SECRET_KEY'
    ]
    
    with open(env_path, 'r') as f:
        content = f.read()
    
    missing_vars = []
    for var in required_vars:
        if var not in content:
            missing_vars.append(var)
    
    if missing_vars:
        print(f"✗ Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    print("✓ Required environment variables found")
    return True

def test_app_structure():
    """Test if all required files exist"""
    required_files = [
        'app.py',
        'requirements.txt',
        'app/__init__.py',
        'app/models/user.py',
        'app/routes/auth_routes.py',
        'app/services/auth_service.py',
        'app/utils/database.py'
    ]
    
    print("Testing file structure...")
    missing_files = []
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✓ {file_path}")
        else:
            print(f"✗ {file_path} - NOT FOUND")
            missing_files.append(file_path)
    
    return len(missing_files) == 0

def main():
    print("=" * 50)
    print("HEALTHCARE PLATFORM BACKEND SETUP TEST")
    print("=" * 50)
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    all_tests_passed = True
    
    # Test imports
    if not test_imports():
        all_tests_passed = False
        print("\nTo install missing modules, run:")
        print("pip install -r requirements.txt")
    
    print()
    
    # Test environment file
    if not test_env_file():
        all_tests_passed = False
        print("\nPlease create a .env file with your Supabase credentials")
    
    print()
    
    # Test file structure
    if not test_app_structure():
        all_tests_passed = False
        print("\nSome required files are missing")
    
    print()
    print("=" * 50)
    if all_tests_passed:
        print("✓ ALL TESTS PASSED - Backend is ready!")
        print("Run 'python app.py' to start the development server")
    else:
        print("✗ SOME TESTS FAILED - Please fix the issues above")
    print("=" * 50)

if __name__ == '__main__':
    main()