// Vitals service for frontend API calls
import api from './api';

class VitalsService {
  // Upload new vital signs
  async uploadVitals(vitalData) {
    try {
      const response = await api.post('/vitals/upload', vitalData);
      return response.data;
    } catch (error) {
      console.error('Upload vitals error:', error);
      throw error;
    }
  }

  // Get vital signs for a specific patient
  async getPatientVitals(patientId, limit = 10) {
    try {
      const response = await api.get(`/vitals/patient/${patientId}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get patient vitals error:', error);
      throw error;
    }
  }

  // Get recent vital signs across all patients
  async getRecentVitals(limit = 20) {
    try {
      const response = await api.get(`/vitals/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get recent vitals error:', error);
      throw error;
    }
  }

  // Get all patients for vitals upload selection
  async getAllPatients() {
    try {
      const response = await api.get('/vitals/patients');
      return response.data;
    } catch (error) {
      console.error('Get patients for vitals error:', error);
      throw error;
    }
  }

  // Validate vital signs data
  validateVitalSigns(vitals) {
    const errors = {};
    
    // Heart rate validation (30-200 BPM)
    if (!vitals.heart_rate || vitals.heart_rate < 30 || vitals.heart_rate > 200) {
      errors.heart_rate = 'Heart rate must be between 30 and 200 BPM';
    }
    
    // Blood pressure validation
    if (!vitals.blood_pressure_systolic || vitals.blood_pressure_systolic < 60 || vitals.blood_pressure_systolic > 250) {
      errors.blood_pressure_systolic = 'Systolic pressure must be between 60 and 250 mmHg';
    }
    
    if (!vitals.blood_pressure_diastolic || vitals.blood_pressure_diastolic < 30 || vitals.blood_pressure_diastolic > 150) {
      errors.blood_pressure_diastolic = 'Diastolic pressure must be between 30 and 150 mmHg';
    }
    
    // Temperature validation (90-110°F)
    if (!vitals.temperature || vitals.temperature < 90 || vitals.temperature > 110) {
      errors.temperature = 'Temperature must be between 90 and 110°F';
    }
    
    // Respiratory rate validation (5-50 breaths/min)
    if (!vitals.respiratory_rate || vitals.respiratory_rate < 5 || vitals.respiratory_rate > 50) {
      errors.respiratory_rate = 'Respiratory rate must be between 5 and 50 breaths per minute';
    }
    
    // Oxygen saturation validation (70-100%)
    if (!vitals.oxygen_saturation || vitals.oxygen_saturation < 70 || vitals.oxygen_saturation > 100) {
      errors.oxygen_saturation = 'Oxygen saturation must be between 70 and 100%';
    }
    
    // Patient ID validation
    if (!vitals.patient_id) {
      errors.patient_id = 'Please select a patient';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Get vital signs status based on values
  getVitalStatus(vitals) {
    const hr = parseInt(vitals.heart_rate);
    const systolic = parseInt(vitals.blood_pressure_systolic);
    const diastolic = parseInt(vitals.blood_pressure_diastolic);
    const temp = parseFloat(vitals.temperature);
    const resp = parseInt(vitals.respiratory_rate);
    const oxygen = parseFloat(vitals.oxygen_saturation);
    
    // Critical ranges
    if (
      hr < 40 || hr > 140 ||
      systolic < 80 || systolic > 180 ||
      diastolic < 50 || diastolic > 110 ||
      temp < 95 || temp > 104 ||
      oxygen < 90 ||
      resp < 8 || resp > 30
    ) {
      return 'critical';
    }
    
    // Abnormal ranges
    if (
      hr < 60 || hr > 100 ||
      systolic < 90 || systolic > 140 ||
      diastolic < 60 || diastolic > 90 ||
      temp < 97 || temp > 99.5 ||
      oxygen < 95 ||
      resp < 12 || resp > 20
    ) {
      return 'abnormal';
    }
    
    return 'normal';
  }

  // Format vital signs for display
  formatVitals(vitals) {
    return {
      ...vitals,
      blood_pressure: `${vitals.blood_pressure_systolic}/${vitals.blood_pressure_diastolic}`,
      temperature_display: `${vitals.temperature}°F`,
      oxygen_saturation_display: `${vitals.oxygen_saturation}%`,
      heart_rate_display: `${vitals.heart_rate} BPM`,
      respiratory_rate_display: `${vitals.respiratory_rate} breaths/min`,
      recorded_at_formatted: vitals.recorded_at ? new Date(vitals.recorded_at).toLocaleString() : 'N/A',
      uploaded_at_formatted: vitals.uploaded_at ? new Date(vitals.uploaded_at).toLocaleString() : 'N/A'
    };
  }

  // Get color for vital status
  getStatusColor(status) {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'abnormal':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }
}

const vitalsService = new VitalsService();
export default vitalsService;