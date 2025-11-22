-- Create lab_reports table in Supabase
CREATE TABLE IF NOT EXISTS lab_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    test_name VARCHAR(150) NOT NULL,
    order_date DATE,
    collection_date DATE NOT NULL,
    result_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
    notes TEXT DEFAULT '',
    test_results JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    
    -- Foreign key constraints
    CONSTRAINT fk_lab_reports_patient 
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_lab_reports_user 
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lab_reports_patient_id ON lab_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_reports_created_by ON lab_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_lab_reports_test_type ON lab_reports(test_type);
CREATE INDEX IF NOT EXISTS idx_lab_reports_status ON lab_reports(status);
CREATE INDEX IF NOT EXISTS idx_lab_reports_result_date ON lab_reports(result_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lab_reports_updated_at 
    BEFORE UPDATE ON lab_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for lab_reports access
CREATE POLICY "Users can view lab reports" ON lab_reports
    FOR SELECT USING (true);

CREATE POLICY "Users can insert lab reports" ON lab_reports
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update lab reports" ON lab_reports
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete lab reports" ON lab_reports
    FOR DELETE USING (true);