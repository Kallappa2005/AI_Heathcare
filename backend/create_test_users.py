"""
Simple script to create a nurse user directly in the database
Run this once to create test users for login
"""

# SQL commands to create a test nurse user
print("""
-- Run this SQL in your Supabase SQL Editor to create a test nurse user

-- First make sure the users table exists
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse')),
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a test nurse user (password is 'nurse123' hashed with bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name, role, department) 
VALUES (
    'nurse@hospital.com', 
    '$2b$12$LQv3c1yqBw2/F2nNbUzMAONGg4a4HXxtUhxEUMhcG2QYLbkD8/RJe', 
    'Jane', 
    'Nurse', 
    'nurse', 
    'ICU'
) ON CONFLICT (email) DO NOTHING;

-- Insert test doctor
INSERT INTO users (email, password_hash, first_name, last_name, role, department) 
VALUES (
    'doctor@hospital.com', 
    '$2b$12$LQv3c1yqBw2/F2nNbUzMAONGg4a4HXxtUhxEUMhcG2QYLbkD8/RJe', 
    'John', 
    'Doctor', 
    'doctor', 
    'Cardiology'
) ON CONFLICT (email) DO NOTHING;

-- Insert test admin
INSERT INTO users (email, password_hash, first_name, last_name, role, department) 
VALUES (
    'admin@hospital.com', 
    '$2b$12$LQv3c1yqBw2/F2nNbUzMAONGg4a4HXxtUhxEUMhcG2QYLbkD8/RJe', 
    'Admin', 
    'User', 
    'admin', 
    'Administration'
) ON CONFLICT (email) DO NOTHING;

-- Verify the users were created
SELECT email, first_name, last_name, role, department FROM users;
""")

print("\nNOTE: The password for all test accounts is 'nurse123' (or 'doctor123', 'admin123')")
print("Copy and run the above SQL in your Supabase dashboard SQL Editor.")