# Database initialization script
import os
import sys
from dotenv import load_dotenv

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.database import init_database, get_supabase_client

def create_tables():
    """Create database tables using Supabase SQL execution"""
    try:
        load_dotenv()
        
        # Get Supabase client
        supabase = get_supabase_client()
        
        # SQL for creating tables
        sql_commands = [
            # Users table
            """
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
            """,
            
            # Patients table
            """
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
                medical_history TEXT,
                current_medications TEXT,
                allergies TEXT,
                insurance_provider VARCHAR(100),
                insurance_number VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                created_by UUID REFERENCES users(id)
            );
            """,
            
            # Vitals table
            """
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
            """,
            
            # AI Insights table
            """
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
            """,
            
            # Medical Notes table
            """
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
            """,
            
            # Staff table
            """
            CREATE TABLE IF NOT EXISTS staff (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                employee_id VARCHAR(50) UNIQUE NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('Doctor', 'Nurse', 'Admin', 'Technician')),
                department VARCHAR(100) NOT NULL,
                specialization VARCHAR(100),
                license_number VARCHAR(100),
                date_of_joining DATE NOT NULL,
                address TEXT,
                emergency_contact_name VARCHAR(100),
                emergency_contact_phone VARCHAR(20),
                status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave')),
                patients_assigned INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
                created_by UUID REFERENCES auth.users(id)
            );
            """,
            
            # Create indexes for better performance
            """
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(medical_record_number);
            CREATE INDEX IF NOT EXISTS idx_vitals_patient_id ON vitals(patient_id);
            CREATE INDEX IF NOT EXISTS idx_vitals_recorded_at ON vitals(recorded_at);
            CREATE INDEX IF NOT EXISTS idx_ai_insights_patient_id ON ai_insights(patient_id);
            CREATE INDEX IF NOT EXISTS idx_medical_notes_patient_id ON medical_notes(patient_id);
            CREATE INDEX IF NOT EXISTS idx_staff_employee_id ON staff(employee_id);
            CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
            CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
            CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);
            CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
            """
        ]
        
        # Execute SQL commands
        for i, sql in enumerate(sql_commands, 1):
            print(f"Executing SQL command {i}/{len(sql_commands)}...")
            
            # For Supabase, we need to execute SQL using the RPC function
            try:
                # Note: This assumes you have an SQL execution function in Supabase
                # You might need to create this function in your Supabase dashboard
                print(f"SQL to execute:\n{sql}")
                print("Please execute this SQL in your Supabase dashboard SQL editor.")
                print("-" * 50)
            except Exception as e:
                print(f"Error executing SQL command {i}: {str(e)}")
                continue
        
        print("Database tables creation script completed!")
        print("\nPlease execute the SQL commands shown above in your Supabase dashboard.")
        print("Go to: Project Dashboard > SQL Editor > New Query")
        
        return True
        
    except Exception as e:
        print(f"Database initialization failed: {str(e)}")
        return False

if __name__ == '__main__':
    create_tables()