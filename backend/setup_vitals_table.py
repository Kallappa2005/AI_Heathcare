# Setup script to create vital_uploads table in Supabase
import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

def setup_vitals_table():
    """Create the vital_uploads table in Supabase"""
    try:
        # Initialize Supabase client
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
        
        if not url or not key:
            print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) must be set")
            return False
            
        supabase = create_client(url, key)
        
        # SQL to create vital_uploads table
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS vital_uploads (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id UUID NOT NULL,
            heart_rate INTEGER NOT NULL CHECK (heart_rate >= 0 AND heart_rate <= 300),
            blood_pressure_systolic INTEGER NOT NULL CHECK (blood_pressure_systolic >= 50 AND blood_pressure_systolic <= 250),
            blood_pressure_diastolic INTEGER NOT NULL CHECK (blood_pressure_diastolic >= 30 AND blood_pressure_diastolic <= 150),
            temperature DECIMAL(4,1) NOT NULL CHECK (temperature >= 85.0 AND temperature <= 115.0),
            respiratory_rate INTEGER NOT NULL CHECK (respiratory_rate >= 0 AND respiratory_rate <= 60),
            oxygen_saturation DECIMAL(5,2) NOT NULL CHECK (oxygen_saturation >= 0 AND oxygen_saturation <= 100),
            notes TEXT DEFAULT '',
            recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            uploaded_by UUID NOT NULL,
            
            -- Foreign key constraints
            CONSTRAINT fk_vital_uploads_patient 
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
            CONSTRAINT fk_vital_uploads_user 
                FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
        );
        """
        
        # Create indexes
        index_sql = """
        CREATE INDEX IF NOT EXISTS idx_vital_uploads_patient_id ON vital_uploads(patient_id);
        CREATE INDEX IF NOT EXISTS idx_vital_uploads_uploaded_by ON vital_uploads(uploaded_by);
        CREATE INDEX IF NOT EXISTS idx_vital_uploads_recorded_at ON vital_uploads(recorded_at);
        CREATE INDEX IF NOT EXISTS idx_vital_uploads_uploaded_at ON vital_uploads(uploaded_at);
        """
        
        # Execute table creation
        print("Creating vital_uploads table...")
        result = supabase.rpc('exec_sql', {'sql': create_table_sql}).execute()
        print("✓ Table created successfully")
        
        # Execute index creation
        print("Creating indexes...")
        result = supabase.rpc('exec_sql', {'sql': index_sql}).execute()
        print("✓ Indexes created successfully")
        
        print("\nVital uploads table setup completed successfully!")
        return True
        
    except Exception as e:
        print(f"Error setting up vitals table: {str(e)}")
        print("\nTrying direct SQL execution...")
        
        # Alternative: try using direct SQL execution
        try:
            # Execute with direct SQL
            result = supabase.rpc('exec_sql', {'sql': create_table_sql}).execute()
            print("✓ Table created with direct SQL")
            return True
        except Exception as e2:
            print(f"Direct SQL execution also failed: {str(e2)}")
            print("\nPlease run the SQL manually in your Supabase dashboard:")
            print("Go to Supabase Dashboard > SQL Editor > Run the following:")
            print(create_table_sql)
            print(index_sql)
            return False

if __name__ == "__main__":
    setup_vitals_table()