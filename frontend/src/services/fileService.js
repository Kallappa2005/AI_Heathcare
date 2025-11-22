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

  // Upload lab reports file (CSV or other formats)
  async uploadLabReports(file, patientId = null) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // For CSV files, patient_id is in the file content
      // For other files, patient_id is required as form data
      const fileExtension = file.name.split('.').pop().toLowerCase()
      if (fileExtension !== 'csv' && !patientId) {
        throw new Error('Patient ID is required for non-CSV files')
      }
      
      if (patientId && fileExtension !== 'csv') {
        formData.append('patient_id', patientId)
      }

      const response = await api.post('/lab-reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Lab report upload failed')
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

  // Validate file type and size
  validateFile(file, allowedTypes = ['text/csv', 'application/pdf'], maxSizeMB = 25) {
    const errors = []
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`)
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${maxSizeMB}MB`)
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Read CSV file content
  async readCSVFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
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