# Database configuration and Supabase client setup
import os
import psycopg2
import psycopg2.extras
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")

# Create Supabase client
supabase: Client = create_client(url, key)

def get_supabase_client():
    """Get Supabase client instance"""
    return supabase

def get_db_connection():
    """Get direct PostgreSQL database connection using Supabase credentials"""
    try:
        # Extract database connection details from Supabase URL
        supabase_url = os.getenv("SUPABASE_URL")
        db_password = os.getenv("SUPABASE_DB_PASSWORD")  # You'll need to add this
        
        if not db_password:
            # Fallback to service role key for database operations
            db_password = os.getenv("SUPABASE_SERVICE_ROLE_KEY", key)
        
        # Parse URL to get connection details
        # Supabase URL format: https://your-project.supabase.co
        project_id = supabase_url.split("//")[1].split(".")[0]
        
        # Supabase PostgreSQL connection details
        connection = psycopg2.connect(
            host=f"db.{project_id}.supabase.co",
            database="postgres", 
            user="postgres",
            password=db_password,
            port=5432
        )
        
        return connection
        
    except Exception as e:
        print(f"Database connection failed: {str(e)}")
        # Fallback: try to use environment variables directly
        try:
            connection = psycopg2.connect(
                host=os.getenv("DB_HOST", "localhost"),
                database=os.getenv("DB_NAME", "postgres"),
                user=os.getenv("DB_USER", "postgres"), 
                password=os.getenv("DB_PASSWORD", ""),
                port=os.getenv("DB_PORT", 5432)
            )
            return connection
        except Exception as fallback_error:
            print(f"Fallback connection also failed: {str(fallback_error)}")
            raise e

# Database table creation SQL
USERS_TABLE_SQL = """
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
"""

PATIENTS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    medical_record_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);
"""

VITALS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS vitals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    heart_rate INTEGER,
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    temperature DECIMAL(4,2),
    oxygen_saturation INTEGER,
    respiratory_rate INTEGER,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    pain_scale INTEGER CHECK (pain_scale >= 0 AND pain_scale <= 10),
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recorded_by UUID REFERENCES users(id)
);
"""

AI_INSIGHTS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    ai_summary TEXT,
    risk_factors JSONB,
    recommendations JSONB,
    key_terms JSONB,
    confidence_score DECIMAL(5,2),
    model_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);
"""

MEDICAL_NOTES_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS medical_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'progress',
    priority VARCHAR(20) DEFAULT 'normal',
    tags JSONB,
    follow_up_date DATE,
    is_confidential BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
"""

def init_database():
    """Initialize database tables"""
    try:
        # Execute table creation SQL
        tables = [
            USERS_TABLE_SQL,
            PATIENTS_TABLE_SQL,
            VITALS_TABLE_SQL,
            AI_INSIGHTS_TABLE_SQL,
            MEDICAL_NOTES_TABLE_SQL
        ]
        
        for table_sql in tables:
            result = supabase.rpc('exec_sql', {'sql': table_sql}).execute()
            print(f"Table created successfully")
            
        print("Database initialization completed successfully!")
        return True
        
    except Exception as e:
        print(f"Database initialization failed: {str(e)}")
        return False