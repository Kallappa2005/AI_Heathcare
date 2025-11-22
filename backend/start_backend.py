#!/usr/bin/env python3

import os
import sys

# Set the working directory to the backend folder
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
os.chdir(backend_dir)

# Add backend to Python path
sys.path.insert(0, backend_dir)

# Import and run the app
try:
    from app import app
    print("Starting Healthcare API server...")
    print("Backend directory:", os.getcwd())
    print("Server running at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
except ImportError as e:
    print(f"Import error: {e}")
    print("Make sure you're running from the Healthcare directory")
except Exception as e:
    print(f"Error starting server: {e}")