import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon, 
  BeakerIcon, 
  CloudArrowUpIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import vitalsService from '../../services/vitalsService'
import labReportsService from '../../services/labReportsService'
import fileService from '../../services/fileService'

const LabReports = () => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showReportForm, setShowReportForm] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeTab, setActiveTab] = useState('upload')
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [labReports, setLabReports] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [reportsLoading, setReportsLoading] = useState(false)
  
  const [reportForm, setReportForm] = useState({
    patientId: '',
    testType: '',
    testName: '',
    orderDate: '',
    collectionDate: '',
    resultDate: new Date().toISOString().slice(0, 10),
    status: 'completed',
    priority: 'normal',
    results: [],
    notes: '',
    attachments: []
  })

  // Load patients data on component mount
  useEffect(() => {
    loadPatientsData()
    console.log('Loaded patients data for lab reports')
  }, [])

  const loadPatientsData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await vitalsService.getAllPatients()
      console.log('Patients data response:', response)
      
      if (response.success && response.patients) {
        setPatients(response.patients)
      } else {
        setError('Failed to load patients data')
        console.error('Failed to load patients:', response)
      }
    } catch (error) {
      console.error('Error loading patients:', error)
      setError('Failed to load patients. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const [labTests] = useState([
    {
      category: 'Blood Chemistry',
      tests: [
        { name: 'Basic Metabolic Panel', code: 'BMP', normalRange: 'Various' },
        { name: 'Comprehensive Metabolic Panel', code: 'CMP', normalRange: 'Various' },
        { name: 'Lipid Panel', code: 'LIPID', normalRange: 'Various' },
        { name: 'Liver Function Tests', code: 'LFT', normalRange: 'Various' }
      ]
    },
    {
      category: 'Hematology',
      tests: [
        { name: 'Complete Blood Count', code: 'CBC', normalRange: 'Various' },
        { name: 'Platelet Count', code: 'PLT', normalRange: '150-450 K/μL' },
        { name: 'ESR', code: 'ESR', normalRange: '<30 mm/hr' },
        { name: 'Hemoglobin A1c', code: 'HBA1C', normalRange: '<5.7%' }
      ]
    },
    {
      category: 'Microbiology',
      tests: [
        { name: 'Blood Culture', code: 'BC', normalRange: 'Negative' },
        { name: 'Urine Culture', code: 'UC', normalRange: 'Negative' },
        { name: 'Wound Culture', code: 'WC', normalRange: 'Negative' }
      ]
    },
    {
      category: 'Imaging',
      tests: [
        { name: 'Chest X-Ray', code: 'CXR', normalRange: 'Normal' },
        { name: 'CT Scan', code: 'CT', normalRange: 'Normal' },
        { name: 'MRI', code: 'MRI', normalRange: 'Normal' },
        { name: 'Ultrasound', code: 'US', normalRange: 'Normal' }
      ]
    }
  ])

  // Load lab reports data
  const loadLabReports = async () => {
    try {
      setReportsLoading(true)
      const response = await labReportsService.getLabReports()
      console.log('Lab reports response:', response)
      
      if (response.success && response.reports) {
        setLabReports(response.reports)
      } else {
        console.error('Failed to load lab reports:', response)
      }
    } catch (error) {
      console.error('Error loading lab reports:', error)
    } finally {
      setReportsLoading(false)
    }
  }

  // Load lab reports on component mount
  useEffect(() => {
    loadLabReports()
  }, [])

  // Load lab reports when View Reports tab is activated
  useEffect(() => {
    if (activeTab === 'reports') {
      loadLabReports()
    }
  }, [activeTab])

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.room?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (e) => {
    setReportForm({
      ...reportForm,
      [e.target.name]: e.target.value
    })
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setReportForm({
      ...reportForm,
      patientId: patient.id
    })
    setShowReportForm(true)
  }

  const handleTestSelect = (category, test) => {
    setReportForm({
      ...reportForm,
      testType: category,
      testName: test.name,
      results: []
    })
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleSubmitReport = async () => {
    try {
      setSubmitting(true)
      
      const reportData = {
        ...reportForm,
        testResults: reportForm.results,
        attachments: selectedFile ? [selectedFile] : []
      }
      
      const response = await labReportsService.createLabReport(reportData)
      
      if (response.success) {
        // Reset form and reload data
        setReportForm({
          patientId: '',
          testType: '',
          testName: '',
          orderDate: '',
          collectionDate: '',
          resultDate: new Date().toISOString().slice(0, 10),
          status: 'completed',
          priority: 'normal',
          results: [],
          notes: '',
          attachments: []
        })
        setSelectedFile(null)
        setShowReportForm(false)
        loadLabReports() // Reload reports
        console.log('Lab report created successfully:', response)
      } else {
        console.error('Failed to create lab report:', response)
        setError('Failed to create lab report. Please try again.')
      }
    } catch (error) {
      console.error('Error creating lab report:', error)
      setError('Error creating lab report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const addTestResult = () => {
    setReportForm({
      ...reportForm,
      results: [...reportForm.results, { parameter: '', value: '', unit: '', normalRange: '', status: 'normal' }]
    })
  }

  const updateTestResult = (index, field, value) => {
    const updatedResults = [...reportForm.results]
    updatedResults[index][field] = value
    setReportForm({
      ...reportForm,
      results: updatedResults
    })
  }

  const removeTestResult = (index) => {
    const updatedResults = reportForm.results.filter((_, i) => i !== index)
    setReportForm({
      ...reportForm,
      results: updatedResults
    })
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setError('Please select a file to upload')
      return
    }

    // Check file extension
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
    
    // For non-CSV files, patient selection is required
    if (fileExtension !== 'csv' && (!selectedPatient || !selectedPatient.id)) {
      setError('Please select a patient first for non-CSV files')
      return
    }
    
    // For CSV files, show info that patient_id should be in the file
    if (fileExtension === 'csv') {
      console.log('CSV file detected - patient_id must be included in the CSV file')
    }
    
    try {
      setSubmitting(true)
      setError('')
      
      // Validate file
      const validation = fileService.validateFile(selectedFile, ['text/csv', 'application/pdf', 'image/jpeg', 'image/png'])
      if (!validation.isValid) {
        setError(validation.errors.join(', '))
        return
      }
      
      console.log('Uploading lab file:', selectedFile.name, 
        fileExtension === 'csv' ? '(patient_id from CSV)' : `for patient: ${selectedPatient?.id}`)
      
      // Upload file using fileService
      // For CSV files, patientId is not needed (it's in the file)
      // For other files, patientId is required
      const result = await fileService.uploadLabReports(
        selectedFile, 
        fileExtension === 'csv' ? null : selectedPatient?.id
      )
      
      if (result.message || result.success !== false) {
        console.log('File uploaded successfully:', result)
        setShowUploadModal(false)
        setSelectedFile(null)
        setSelectedPatient(null)
        
        // Reload lab reports to show the new upload
        await loadLabReports()
        
        // Show success message
        alert(`Lab report "${selectedFile.name}" uploaded successfully!`)
      } else {
        setError('Failed to upload file')
      }
      
    } catch (error) {
      console.error('Error uploading file:', error)
      setError(error.message || 'Failed to upload file. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError('')
      
      // Validate form data
      const validation = labReportsService.validateLabReport(reportForm)
      if (!validation.isValid) {
        setError('Please fill in all required fields correctly')
        console.error('Validation errors:', validation.errors)
        return
      }
      
      // Format data for API
      const formattedData = labReportsService.formatLabReportForAPI(reportForm)
      
      console.log('Submitting lab report:', formattedData)
      
      // Submit to API
      const response = await labReportsService.createLabReport(formattedData)
      
      if (response.success) {
        console.log('Lab report created successfully:', response.report_id)
        
        // Reset form
        setReportForm({
          patientId: '',
          testType: '',
          testName: '',
          orderDate: '',
          collectionDate: '',
          resultDate: new Date().toISOString().slice(0, 10),
          status: 'completed',
          priority: 'normal',
          results: [],
          notes: '',
          attachments: []
        })
        
        setShowReportForm(false)
        setSelectedPatient(null)
        
        // Reload lab reports if on reports tab
        if (activeTab === 'reports') {
          await loadLabReports()
        }
        
        alert('Lab report saved successfully!')
      } else {
        setError(response.error || 'Failed to save lab report')
      }
      
    } catch (error) {
      console.error('Error submitting lab report:', error)
      setError('Failed to save lab report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'in-progress': return 'primary'
      case 'critical': return 'danger'
      default: return 'secondary'
    }
  }

  const getResultStatusColor = (status) => {
    switch (status) {
      case 'high': return 'danger'
      case 'low': return 'warning'
      case 'critical': return 'danger'
      case 'normal': return 'success'
      default: return 'secondary'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'danger'
      case 'high': return 'warning'
      case 'normal': return 'success'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lab Reports</h1>
            <p className="text-gray-600 mt-1">Manage patient laboratory test results</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
            >
              <CloudArrowUpIcon className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant={activeTab === 'upload' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('upload')}
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
            <Button
              variant={activeTab === 'reports' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('reports')}
            >
              <BeakerIcon className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upload Lab Report File</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setSelectedFile(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleFileUpload} className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start">
                    <BeakerIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-900">Supported File Types</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>PDF reports from laboratory systems</li>
                          <li>CSV files with test results</li>
                          <li>Images of lab result printouts (JPG, PNG)</li>
                          <li>Maximum file size: 25MB</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Lab Report File
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <CloudArrowUpIcon className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, CSV, JPG, or PNG (MAX. 25MB)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.csv,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="mt-3 flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
                      <DocumentTextIcon className="h-5 w-5 mr-3 text-green-600" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{selectedFile.name}</span>
                        <span className="ml-2 text-sm text-gray-500">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID (For non-CSV files only)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter patient ID for PDF/Image files"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={selectedFile?.name?.toLowerCase().endsWith('.csv')}
                  />
                  {selectedFile?.name?.toLowerCase().endsWith('.csv') && (
                    <p className="text-xs text-blue-600 mt-1">
                      Patient ID not needed for CSV files - it should be included in the CSV content
                    </p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> 
                    {selectedFile?.name?.toLowerCase().endsWith('.csv') ? (
                      <>
                        CSV files must include patient_id as a mandatory column. 
                        Required columns: patient_id, test_type, test_name, collection_date, result_date.
                        Optional: parameter, value, unit, normal_range, result_status, notes.
                      </>
                    ) : (
                      <>
                        Files will be processed and results will be extracted automatically. Manual verification may be required.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowUploadModal(false)
                    setSelectedFile(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedFile}
                >
                  <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                  Upload Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Selection */}
          <div>
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Select Patient for Lab Entry
                </Card.Title>
                <div className="mt-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </Card.Header>
              <Card.Content className="p-0">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md m-4">
                    <div className="text-sm text-red-600">{error}</div>
                    <Button
                      size="sm"
                      onClick={loadPatientsData}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading patients...
                    </div>
                  ) : filteredPatients.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {searchQuery ? 'No patients found matching your search' : 'No patients found'}
                    </div>
                  ) : (
                    filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => handlePatientSelect(patient)}
                        className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{patient.name}</h3>
                            <p className="text-sm text-gray-600">
                              ID: {patient.patient_id || patient.id} • Room: {patient.room || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">{patient.condition || 'No diagnosis'}</p>
                            {patient.phone && (
                              <p className="text-xs text-gray-400">Phone: {patient.phone}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <Badge variant={patient.age > 65 ? 'warning' : 'success'}>
                              Age {patient.age || 'N/A'}
                            </Badge>
                            {patient.emergency_contact && (
                              <p className="text-xs text-gray-500 mt-1">
                                Emergency: {patient.emergency_contact}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Lab Test Categories */}
          <div>
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <BeakerIcon className="h-5 w-5 mr-2" />
                  Available Lab Tests
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {labTests.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                      <div className="space-y-1">
                        {category.tests.map((test, testIndex) => (
                          <button
                            key={testIndex}
                            onClick={() => handleTestSelect(category.category, test)}
                            className="w-full text-left p-2 text-sm hover:bg-blue-50 rounded-md transition-colors border border-gray-200"
                          >
                            <div className="font-medium">{test.name}</div>
                            <div className="text-gray-500 text-xs">Code: {test.code}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reportsLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading lab reports...</div>
            </div>
          ) : labReports.length === 0 ? (
            <div className="text-center py-8">
              <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <div className="text-gray-500">No lab reports found</div>
              <Button 
                className="mt-3"
                onClick={() => setActiveTab('upload')}
              >
                Create First Report
              </Button>
            </div>
          ) : (
            labReports.map((report) => (
              <Card key={report.id}>
                <Card.Content className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{report.test_name}</h3>
                      <p className="text-gray-600">{report.patient_name} ({report.patient_id_display})</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Collected: {labReportsService.formatDate(report.collection_date)}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Resulted: {labReportsService.formatDate(report.result_date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={labReportsService.getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <Badge variant={labReportsService.getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                    </div>
                  </div>

                  {report.test_results && report.test_results.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Normal Range</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {report.test_results.map((result, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">{result.parameter}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 font-medium">{result.value}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{result.unit}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{result.normalRange || result.normal_range}</td>
                              <td className="px-4 py-2">
                                <Badge variant={labReportsService.getResultStatusColor(result.status)}>
                                  {result.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {labReportsService.hasCriticalResults(report.test_results) && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm font-medium text-red-800">Critical Values:</span>
                        <span className="text-sm text-red-700 ml-2">
                          {labReportsService.getCriticalParameters(report.test_results).join(', ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {report.notes && (
                    <div className="mt-4 text-sm text-gray-600">
                      <strong>Notes:</strong> {report.notes}
                    </div>
                  )}

                  <div className="mt-4 text-sm text-gray-500">
                    Created: {labReportsService.formatDateTime(report.created_at)}
                  </div>
                </Card.Content>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Lab Report Upload Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Enter Lab Results
                  {selectedPatient && (
                    <span className="text-blue-600 ml-2">- {selectedPatient.name}</span>
                  )}
                </h2>
                <button
                  onClick={() => {
                    setShowReportForm(false)
                    setSelectedPatient(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                      <input
                        type="text"
                        name="patientId"
                        value={reportForm.patientId}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                      <input
                        type="text"
                        name="testType"
                        value={reportForm.testType}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                    <input
                      type="text"
                      name="testName"
                      value={reportForm.testName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                      <input
                        type="date"
                        name="orderDate"
                        value={reportForm.orderDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
                      <input
                        type="date"
                        name="collectionDate"
                        value={reportForm.collectionDate}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Result Date</label>
                      <input
                        type="date"
                        name="resultDate"
                        value={reportForm.resultDate}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={reportForm.status}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        name="priority"
                        value={reportForm.priority}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Test Results</h3>
                    <Button
                      type="button"
                      onClick={addTestResult}
                      size="sm"
                      variant="secondary"
                    >
                      Add Result
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {reportForm.results.map((result, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-md">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Parameter</label>
                            <input
                              type="text"
                              value={result.parameter}
                              onChange={(e) => updateTestResult(index, 'parameter', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="e.g., Glucose"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Value</label>
                            <input
                              type="text"
                              value={result.value}
                              onChange={(e) => updateTestResult(index, 'value', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="e.g., 142"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Unit</label>
                            <input
                              type="text"
                              value={result.unit}
                              onChange={(e) => updateTestResult(index, 'unit', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="e.g., mg/dL"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Normal Range</label>
                            <input
                              type="text"
                              value={result.normalRange}
                              onChange={(e) => updateTestResult(index, 'normalRange', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="e.g., 70-100"
                            />
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <select
                            value={result.status}
                            onChange={(e) => updateTestResult(index, 'status', e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="low">Low</option>
                            <option value="critical">Critical</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeTestResult(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={reportForm.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes or observations..."
                />
              </div>

              {/* Error display */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-sm text-red-600">{error}</div>
                </div>
              )}

              {/* File Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <PaperClipIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Drag and drop lab report files here, or click to browse</p>
                  <input type="file" multiple accept=".pdf,.jpg,.png" className="hidden" />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowReportForm(false)
                    setSelectedPatient(null)
                    setError('')
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="inline-flex items-center"
                  disabled={submitting}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {submitting ? 'Saving...' : 'Save Lab Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LabReports