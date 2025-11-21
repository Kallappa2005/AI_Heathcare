import { useState } from 'react'
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

const VitalsUpload = () => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  
  const [vitalsForm, setVitalsForm] = useState({
    patientId: '',
    heartRate: '',
    systolic: '',
    diastolic: '',
    temperature: '',
    oxygenSaturation: '',
    respiration: '',
    recordedTime: new Date().toISOString().slice(0, 16),
    notes: ''
  })

  const [patients] = useState([
    { 
      id: 'P001', 
      name: 'John Anderson', 
      age: 67, 
      room: '101A',
      condition: 'Hypertension',
      lastVitals: '2024-11-21 08:00',
      alertLevel: 'high'
    },
    { 
      id: 'P002', 
      name: 'Sarah Johnson', 
      age: 34, 
      room: '102B',
      condition: 'Diabetes Type 2',
      lastVitals: '2024-11-21 06:30',
      alertLevel: 'normal'
    },
    { 
      id: 'P003', 
      name: 'Maria Garcia', 
      age: 54, 
      room: '103A',
      condition: 'Post-surgery',
      lastVitals: '2024-11-21 07:15',
      alertLevel: 'normal'
    },
    { 
      id: 'P004', 
      name: 'Robert Chen', 
      age: 72, 
      room: '104B',
      condition: 'COPD',
      lastVitals: '2024-11-20 22:45',
      alertLevel: 'warning'
    }
  ])

  const [recentVitals] = useState([
    {
      id: 1,
      patientId: 'P001',
      patientName: 'John Anderson',
      heartRate: 88,
      bloodPressure: '168/95',
      temperature: 98.6,
      oxygenSaturation: 96,
      respiration: 18,
      recordedTime: '2024-11-21 08:00',
      recordedBy: 'Nurse Johnson',
      status: 'abnormal'
    },
    {
      id: 2,
      patientId: 'P002',
      patientName: 'Sarah Johnson',
      heartRate: 72,
      bloodPressure: '128/82',
      temperature: 98.2,
      oxygenSaturation: 98,
      respiration: 16,
      recordedTime: '2024-11-21 06:30',
      recordedBy: 'Nurse Johnson',
      status: 'normal'
    },
    {
      id: 3,
      patientId: 'P003',
      patientName: 'Maria Garcia',
      heartRate: 68,
      bloodPressure: '118/76',
      temperature: 98.4,
      oxygenSaturation: 99,
      respiration: 14,
      recordedTime: '2024-11-21 07:15',
      recordedBy: 'Nurse Johnson',
      status: 'normal'
    }
  ])

  const vitalsTemplates = [
    { name: 'Normal Adult', hr: '72', sys: '120', dia: '80', temp: '98.6', spo2: '98', resp: '16' },
    { name: 'Post-Op', hr: '75', sys: '110', dia: '70', temp: '99.0', spo2: '97', resp: '18' },
    { name: 'Elderly', hr: '70', sys: '130', dia: '85', temp: '98.4', spo2: '96', resp: '18' }
  ]

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.room.toLowerCase().includes(searchQuery.toLowerCase())
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
      patientId: patient.id
    })
    setShowUploadForm(true)
  }

  const handleTemplateApply = (template) => {
    setVitalsForm({
      ...vitalsForm,
      heartRate: template.hr,
      systolic: template.sys,
      diastolic: template.dia,
      temperature: template.temp,
      oxygenSaturation: template.spo2,
      respiration: template.resp
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting vitals:', vitalsForm)
    alert('Vitals uploaded successfully!')
    setShowUploadForm(false)
    setVitalsForm({
      patientId: '',
      heartRate: '',
      systolic: '',
      diastolic: '',
      temperature: '',
      oxygenSaturation: '',
      respiration: '',
      recordedTime: new Date().toISOString().slice(0, 16),
      notes: ''
    })
    setSelectedPatient(null)
  }

  const getAlertColor = (level) => {
    switch (level) {
      case 'high': return 'danger'
      case 'warning': return 'warning'
      case 'normal': return 'success'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status) => {
    return status === 'abnormal' ? 'danger' : 'success'
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
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-600">ID: {patient.id} • Room: {patient.room}</p>
                        <p className="text-xs text-gray-500">{patient.condition}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getAlertColor(patient.alertLevel)}>
                          {patient.alertLevel}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          Last: {patient.lastVitals}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
                {recentVitals.map((vital) => (
                  <div key={vital.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{vital.patientName}</h4>
                      <Badge variant={getStatusColor(vital.status)}>
                        {vital.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">HR:</span>
                        <span className="ml-1 font-medium">{vital.heartRate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">BP:</span>
                        <span className="ml-1 font-medium">{vital.bloodPressure}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Temp:</span>
                        <span className="ml-1 font-medium">{vital.temperature}°F</span>
                      </div>
                      <div>
                        <span className="text-gray-500">SpO2:</span>
                        <span className="ml-1 font-medium">{vital.oxygenSaturation}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">RR:</span>
                        <span className="ml-1 font-medium">{vital.respiration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">{vital.recordedTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                      name="patientId"
                      value={vitalsForm.patientId}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter patient ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recording Time</label>
                    <input
                      type="datetime-local"
                      name="recordedTime"
                      value={vitalsForm.recordedTime}
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
                        name="heartRate"
                        value={vitalsForm.heartRate}
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
                        name="systolic"
                        value={vitalsForm.systolic}
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
                        name="diastolic"
                        value={vitalsForm.diastolic}
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
                        name="oxygenSaturation"
                        value={vitalsForm.oxygenSaturation}
                        onChange={handleInputChange}
                        required
                        min="70"
                        max="100"
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
                        name="respiration"
                        value={vitalsForm.respiration}
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
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="inline-flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Upload Vitals
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