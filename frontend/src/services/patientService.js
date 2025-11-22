import api from './api'

export const patientService = {
  // Get all patients with optional filters
  async getPatients(params = {}) {
    try {
      const response = await api.get('/patients/', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch patients')
    }
  },

  // Get patient by ID
  async getPatientById(id) {
    try {
      const response = await api.get(`/patients/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient')
    }
  },

  // Create new patient / Register patient
  async createPatient(patientData) {
    try {
      const response = await api.post('/patients/register', patientData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create patient')
    }
  },

  // Register patient (alias for createPatient)
  async registerPatient(patientData) {
    return this.createPatient(patientData)
  },

  // Update patient
  async updatePatient(id, patientData) {
    try {
      const response = await api.put(`/patients/${id}`, patientData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update patient')
    }
  },

  // Get patient vitals
  async getPatientVitals(id, params = {}) {
    try {
      const response = await api.get(`/patients/${id}/vitals`, { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vitals')
    }
  },

  // Add patient vitals
  async addPatientVitals(id, vitalsData) {
    try {
      const response = await api.post(`/patients/${id}/vitals`, vitalsData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add vitals')
    }
  },

  // Get AI insights for patient
  async getPatientInsights(id) {
    try {
      const response = await api.get(`/patients/${id}/insights`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch insights')
    }
  },

  // Search patients with natural language
  async searchPatients(query, filters = {}) {
    try {
      const response = await api.get(`/patients/search?q=${encodeURIComponent(query)}`, { params: filters })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Search failed')
    }
  },

  // Validate patient ID availability
  async validatePatientId(patientId) {
    try {
      const response = await api.get(`/patients/validate-patient-id/${patientId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to validate patient ID')
    }
  }
}

export default patientService