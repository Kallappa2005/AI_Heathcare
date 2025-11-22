import { useState, useEffect } from 'react'
import { 
  HeartIcon, 
  FireIcon, 
  ClockIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import vitalsService from '../../services/vitalsService'

const VitalsUpload = () => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [patients, setPatients] = useState([])
  const [recentVitals, setRecentVitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [vitalsForm, setVitalsForm] = useState({
    patient_id: '',
    heart_rate: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    temperature: '',
    oxygen_saturation: '',
    respiratory_rate: '',
    recorded_at: new Date().toISOString().slice(0, 16),
    notes: ''
  })

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load patients and recent vitals in parallel
      const [patientsResult, vitalsResult] = await Promise.all([
        vitalsService.getAllPatients(),
        vitalsService.getRecentVitals(10)
      ])
      
      if (patientsResult.success) {
        setPatients(patientsResult.patients || [])
      } else {
        console.error('Failed to load patients:', patientsResult.error)
      }
      
      if (vitalsResult.success) {
        setRecentVitals(vitalsResult.vitals || [])
      } else {
        console.error('Failed to load recent vitals:', vitalsResult.error)
      }
      
    } catch (error) {
      console.error('Error loading initial data:', error)
      setError('Failed to load data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const vitalsTemplates = [
    { name: 'Normal Adult', hr: '72', sys: '120', dia: '80', temp: '98.6', spo2: '98', resp: '16' },
    { name: 'Post-Op', hr: '75', sys: '110', dia: '70', temp: '99.0', spo2: '97', resp: '18' },
    { name: 'Elderly', hr: '70', sys: '130', dia: '85', temp: '98.4', spo2: '96', resp: '18' }
  ]

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.room?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (e) => {
    setVitalsForm({
      ...vitalsForm,
      [e.target.name]: e.target.value
    })
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setVitalsForm({
      ...vitalsForm,
      patient_id: patient.id
    })
    setShowUploadForm(true)
  }

  const handleTemplateApply = (template) => {
    setVitalsForm({
      ...vitalsForm,
      heart_rate: template.hr,
      blood_pressure_systolic: template.sys,
      blood_pressure_diastolic: template.dia,
      temperature: template.temp,
      oxygen_saturation: template.spo2,
      respiratory_rate: template.resp
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError('')
      
      // Validate form data
      const validation = vitalsService.validateVitalSigns(vitalsForm)
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(', ')
        setError(errorMessages)
        return
      }
      
      // Submit vitals
      const result = await vitalsService.uploadVitals(vitalsForm)
      
      if (result.success) {
        // Clear form and close modal
        setVitalsForm({
          patient_id: '',
          heart_rate: '',
          blood_pressure_systolic: '',
          blood_pressure_diastolic: '',
          temperature: '',
          oxygen_saturation: '',
          respiratory_rate: '',
          recorded_at: new Date().toISOString().slice(0, 16),
          notes: ''
        })
        setSelectedPatient(null)
        setShowUploadForm(false)
        setError('')
        
        // Reload recent vitals
        loadInitialData()
        
        alert('Vitals uploaded successfully!')
      } else {
        setError(result.error || 'Failed to upload vitals')
      }
      
    } catch (error) {
      console.error('Submit vitals error:', error)
      setError('Failed to submit vitals. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getVitalStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'success'
      case 'abnormal': return 'warning'
      case 'critical': return 'danger'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vitals Upload</h1>
            <p className="text-gray-600 mt-1">Record and monitor patient vital signs</p>
          </div>
          <Button
            onClick={() => setShowUploadForm(true)}
            className="inline-flex items-center"
          >
            <CloudArrowUpIcon className="h-4 w-4 mr-2" />
            Quick Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Selection */}
        <div className="space-y-4">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Select Patient
              </Card.Title>
              <div className="mt-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, or room..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading patients...
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No patients found
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
                        </div>
                        <div className="text-right">
                          <Badge variant={patient.age > 65 ? 'warning' : 'success'}>
                            Age {patient.age || 'N/A'}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Last: {patient.lastVitals || 'No recent vitals'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Recent Vitals */}
        <div>
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Recent Vital Signs
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center text-gray-500">
                    Loading recent vitals...
                  </div>
                ) : recentVitals.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No recent vitals found
                  </div>
                ) : (
                  recentVitals.map((vital) => (
                    <div key={vital.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{vital.patient_name}</h4>
                        <Badge variant={getVitalStatusColor(vitalsService.getVitalStatus({
                          heart_rate: vital.heart_rate,
                          blood_pressure_systolic: vital.blood_pressure_systolic,
                          blood_pressure_diastolic: vital.blood_pressure_diastolic,
                          temperature: vital.temperature,
                          respiratory_rate: vital.respiratory_rate,
                          oxygen_saturation: vital.oxygen_saturation
                        }))}>
                          {vitalsService.getVitalStatus({
                            heart_rate: vital.heart_rate,
                            blood_pressure_systolic: vital.blood_pressure_systolic,
                            blood_pressure_diastolic: vital.blood_pressure_diastolic,
                            temperature: vital.temperature,
                            respiratory_rate: vital.respiratory_rate,
                            oxygen_saturation: vital.oxygen_saturation
                          })}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">HR:</span>
                          <span className="ml-1 font-medium">{vital.heart_rate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">BP:</span>
                          <span className="ml-1 font-medium">
                            {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Temp:</span>
                          <span className="ml-1 font-medium">{vital.temperature}°F</span>
                        </div>
                        <div>
                          <span className="text-gray-500">SpO2:</span>
                          <span className="ml-1 font-medium">{vital.oxygen_saturation}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">RR:</span>
                          <span className="ml-1 font-medium">{vital.respiratory_rate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">
                            {vital.recorded_at ? new Date(vital.recorded_at).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Vitals Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upload Vital Signs
                  {selectedPatient && (
                    <span className="text-blue-600 ml-2">- {selectedPatient.name}</span>
                  )}
                </h2>
                <button
                  onClick={() => {
                    setShowUploadForm(false)
                    setSelectedPatient(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                    <input
                      type="text"
                      name="patient_id"
                      value={vitalsForm.patient_id}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Select patient from the list"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recording Time</label>
                    <input
                      type="datetime-local"
                      name="recorded_at"
                      value={vitalsForm.recorded_at}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
                    <div className="space-y-2">
                      {vitalsTemplates.map((template, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleTemplateApply(template)}
                          className="w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Vital Signs</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        name="heart_rate"
                        value={vitalsForm.heart_rate}
                        onChange={handleInputChange}
                        required
                        min="30"
                        max="200"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="72"
                      />
                      <p className="text-xs text-gray-500 mt-1">Normal: 60-100 bpm</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature (°F)
                      </label>
                      <input
                        type="number"
                        name="temperature"
                        value={vitalsForm.temperature}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="90"
                        max="110"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="98.6"
                      />
                      <p className="text-xs text-gray-500 mt-1">Normal: 97-99.5°F</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Systolic BP (mmHg)
                      </label>
                      <input
                        type="number"
                        name="blood_pressure_systolic"
                        value={vitalsForm.blood_pressure_systolic}
                        onChange={handleInputChange}
                        required
                        min="60"
                        max="300"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diastolic BP (mmHg)
                      </label>
                      <input
                        type="number"
                        name="blood_pressure_diastolic"
                        value={vitalsForm.blood_pressure_diastolic}
                        onChange={handleInputChange}
                        required
                        min="40"
                        max="150"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="80"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SpO2 (%)
                      </label>
                      <input
                        type="number"
                        name="oxygen_saturation"
                        value={vitalsForm.oxygen_saturation}
                        onChange={handleInputChange}
                        required
                        min="70"
                        max="100"
                        step="0.1"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="98"
                      />
                      <p className="text-xs text-gray-500 mt-1">Normal: &gt;95%</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Respiration (breaths/min)
                      </label>
                      <input
                        type="number"
                        name="respiratory_rate"
                        value={vitalsForm.respiratory_rate}
                        onChange={handleInputChange}
                        required
                        min="8"
                        max="40"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="16"
                      />
                      <p className="text-xs text-gray-500 mt-1">Normal: 12-20/min</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={vitalsForm.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional observations or notes..."
                    />
                  </div>

                  {/* Error display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <div className="text-sm text-red-600">{error}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowUploadForm(false)
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
                  {submitting ? 'Uploading...' : 'Upload Vitals'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VitalsUpload