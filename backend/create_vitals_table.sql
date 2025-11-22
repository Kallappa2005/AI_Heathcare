-- Create vital_uploads table for storing patient vital signs
CREATE TABLE IF NOT EXISTS vital_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    heart_rate INTEGER NOT NULL CHECK (heart_rate >= 30 AND heart_rate <= 300),
    blood_pressure_systolic INTEGER NOT NULL CHECK (blood_pressure_systolic >= 70 AND blood_pressure_systolic <= 250),
    blood_pressure_diastolic INTEGER NOT NULL CHECK (blood_pressure_diastolic >= 30 AND blood_pressure_diastolic <= 150),
    temperature DECIMAL(4,1) NOT NULL CHECK (temperature >= 85.0 AND temperature <= 115.0),
    respiratory_rate INTEGER NOT NULL CHECK (respiratory_rate >= 5 AND respiratory_rate <= 60),
    oxygen_saturation DECIMAL(5,2) NOT NULL CHECK (oxygen_saturation >= 70 AND oxygen_saturation <= 100),
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vital_uploads_patient_id ON vital_uploads(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_uploads_uploaded_by ON vital_uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_vital_uploads_recorded_at ON vital_uploads(recorded_at);
CREATE INDEX IF NOT EXISTS idx_vital_uploads_uploaded_at ON vital_uploads(uploaded_at);

