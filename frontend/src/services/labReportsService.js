import api from './api'

const labReportsService = {
  // Create a new lab report
  async createLabReport(reportData) {
    try {
      const response = await api.post('/lab-reports/create', reportData)
      return { success: true, report: response.data.report }
    } catch (error) {
      console.error('Error creating lab report:', error)
      return { success: false, error: error.response?.data?.error || 'Failed to create lab report' }
    }
  },

  // Get all lab reports
  async getLabReports() {
    try {
      const response = await api.get('/lab-reports/list')
      return { success: true, reports: response.data.reports }
    } catch (error) {
      console.error('Error fetching lab reports:', error)
      return { success: false, error: error.response?.data?.error || 'Failed to fetch lab reports' }
    }
  },

  // Get lab report by ID
  async getLabReportById(reportId) {
    try {
      const response = await api.get(`/lab-reports/${reportId}`)
      return { success: true, report: response.data.report }
    } catch (error) {
      console.error('Error fetching lab report:', error)
      return { success: false, error: error.response?.data?.error || 'Failed to fetch lab report' }
    }
  },

  // Validate lab report data
  validateLabReport(reportData) {
    const errors = []
    
    if (!reportData.patientId) errors.push('Patient ID is required')
    if (!reportData.testType) errors.push('Test type is required')
    if (!reportData.testName) errors.push('Test name is required')
    if (!reportData.collectionDate) errors.push('Collection date is required')
    if (!reportData.resultDate) errors.push('Result date is required')
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Format lab report for display
  formatLabReport(report) {
    return {
      ...report,
      collectionDate: new Date(report.collectionDate).toLocaleDateString(),
      resultDate: new Date(report.resultDate).toLocaleDateString(),
      orderDate: report.orderDate ? new Date(report.orderDate).toLocaleDateString() : null
    }
  },

  // Format lab report data for API submission
  formatLabReportForAPI(reportData) {
    return {
      patientId: reportData.patientId,
      testType: reportData.testType,
      testName: reportData.testName,
      orderDate: reportData.orderDate || null,
      collectionDate: reportData.collectionDate,
      resultDate: reportData.resultDate,
      status: reportData.status || 'completed',
      priority: reportData.priority || 'normal',
      notes: reportData.notes || '',
      results: reportData.results || [],
      attachments: reportData.attachments || []
    }
  },

  // Upload lab report file (CSV/PDF)
  async uploadLabReportFile(file, patientId) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('patient_id', patientId)

      const response = await api.post('/lab-reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error uploading lab report file:', error)
      return { success: false, error: error.response?.data?.error || 'Failed to upload file' }
    }
  },

  // Parse CSV content
  parseCSV(csvContent) {
    const lines = csvContent.split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const reports = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(',').map(v => v.trim())
      const report = {}
      
      headers.forEach((header, index) => {
        report[header] = values[index] || ''
      })

      if (report.test_type && report.test_name) {
        reports.push(report)
      }
    }

    return this.groupCSVReports(reports)
  },

  // Group CSV reports by test
  groupCSVReports(reports) {
    const groupedReports = {}
    
    reports.forEach(report => {
      const key = `${report.test_type}-${report.test_name}-${report.collection_date}`
      
      if (!groupedReports[key]) {
        groupedReports[key] = {
          testType: report.test_type,
          testName: report.test_name,
          orderDate: report.order_date,
          collectionDate: report.collection_date,
          resultDate: report.result_date,
          status: report.status || 'completed',
          priority: report.priority || 'normal',
          notes: report.notes || '',
          results: []
        }
      }

      if (report.parameter) {
        groupedReports[key].results.push({
          parameter: report.parameter,
          value: report.value,
          unit: report.unit,
          normalRange: report.normal_range,
          status: report.result_status || 'normal'
        })
      }
    })

    return Object.values(groupedReports)
  },

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  },

  // Format datetime for display
  formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'N/A'
    return new Date(dateTimeString).toLocaleString()
  },

  // Get status color for badge
  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning'
      case 'in-progress': return 'info'
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      default: return 'secondary'
    }
  },

  // Get result status color for badge
  getResultStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'low': return 'info'
      case 'high': return 'warning'
      case 'critical': return 'error'
      case 'normal': return 'success'
      default: return 'secondary'
    }
  },

  // Get priority color for badge
  getPriorityColor(priority) {
    switch (priority?.toLowerCase()) {
      case 'high': return 'warning'
      case 'urgent': return 'error'
      case 'normal': return 'secondary'
      default: return 'secondary'
    }
  },

  // Check if report has critical results
  hasCriticalResults(testResults) {
    if (!Array.isArray(testResults)) return false
    return testResults.some(result => result.status?.toLowerCase() === 'critical')
  },

  // Get critical parameters
  getCriticalParameters(testResults) {
    if (!Array.isArray(testResults)) return []
    return testResults
      .filter(result => result.status?.toLowerCase() === 'critical')
      .map(result => result.parameter)
  }
}

export default labReportsService