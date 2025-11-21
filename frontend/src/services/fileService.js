import api from './api'

export const fileService = {
  // Upload vitals CSV file
  async uploadVitals(file, patientId = null) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (patientId) formData.append('patientId', patientId)

      const response = await api.post('/upload/vitals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Upload failed')
    }
  },

  // Upload lab results PDF
  async uploadLabResults(file, patientId) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('patientId', patientId)

      const response = await api.post('/upload/lab-results', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Upload failed')
    }
  },

  // Bulk upload patients CSV
  async bulkUploadPatients(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/upload/patients-bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Bulk upload failed')
    }
  },

  // Upload medical notes/reports
  async uploadMedicalNotes(file, patientId, type = 'consultation') {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('patientId', patientId)
      formData.append('type', type)

      const response = await api.post('/upload/medical-notes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Upload failed')
    }
  },

  // Get upload history
  async getUploadHistory(params = {}) {
    try {
      const response = await api.get('/upload/history', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch upload history')
    }
  }
}

export default fileService