import { useState } from 'react'
import { 
  ClipboardDocumentListIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BeakerIcon,
  CalendarIcon,
  BellAlertIcon,
  CloudArrowUpIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const MedicationLog = () => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMedicationForm, setShowMedicationForm] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeTab, setActiveTab] = useState('schedule')
  
  const [medicationForm, setMedicationForm] = useState({
    patientId: '',
    medicationName: '',
    dosage: '',
    unit: 'mg',
    route: 'oral',
    frequency: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    scheduledTime: '',
    givenBy: '',
    status: 'pending',
    notes: '',
    sideEffects: []
  })

  const [patients] = useState([
    { 
      id: 'P001', 
      name: 'John Anderson', 
      age: 67, 
      room: '101A',
      condition: 'Hypertension',
      pendingMeds: 3,
      allergies: ['Penicillin', 'Sulfa']
    },
    { 
      id: 'P002', 
      name: 'Sarah Johnson', 
      age: 34, 
      room: '102B',
      condition: 'Diabetes Type 2',
      pendingMeds: 2,
      allergies: ['None known']
    },
    { 
      id: 'P003', 
      name: 'Maria Garcia', 
      age: 54, 
      room: '103A',
      condition: 'Post-surgery',
      pendingMeds: 4,
      allergies: ['Latex', 'Iodine']
    },
    { 
      id: 'P004', 
      name: 'Robert Chen', 
      age: 72, 
      room: '104B',
      condition: 'COPD',
      pendingMeds: 1,
      allergies: ['None known']
    }
  ])

  const [commonMedications] = useState([
    { name: 'Acetaminophen', dosages: ['325mg', '500mg', '650mg'], routes: ['oral', 'IV'] },
    { name: 'Ibuprofen', dosages: ['200mg', '400mg', '600mg', '800mg'], routes: ['oral'] },
    { name: 'Morphine', dosages: ['2mg', '4mg', '10mg', '15mg'], routes: ['IV', 'oral', 'subcutaneous'] },
    { name: 'Metformin', dosages: ['500mg', '850mg', '1000mg'], routes: ['oral'] },
    { name: 'Lisinopril', dosages: ['5mg', '10mg', '20mg', '40mg'], routes: ['oral'] },
    { name: 'Aspirin', dosages: ['81mg', '325mg'], routes: ['oral'] },
    { name: 'Furosemide', dosages: ['20mg', '40mg', '80mg'], routes: ['oral', 'IV'] },
    { name: 'Omeprazole', dosages: ['20mg', '40mg'], routes: ['oral', 'IV'] }
  ])

  const [medicationLog] = useState([
    {
      id: 1,
      patientId: 'P001',
      patientName: 'John Anderson',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      route: 'oral',
      scheduledTime: '2024-11-22 08:00',
      actualTime: '2024-11-22 08:15',
      givenBy: 'Nurse Smith',
      status: 'administered',
      notes: 'Patient tolerated well',
      sideEffects: []
    },
    {
      id: 2,
      patientId: 'P001',
      patientName: 'John Anderson',
      medicationName: 'Furosemide',
      dosage: '40mg',
      route: 'oral',
      scheduledTime: '2024-11-22 14:00',
      actualTime: null,
      givenBy: '',
      status: 'pending',
      notes: '',
      sideEffects: []
    },
    {
      id: 3,
      patientId: 'P002',
      patientName: 'Sarah Johnson',
      medicationName: 'Metformin',
      dosage: '500mg',
      route: 'oral',
      scheduledTime: '2024-11-22 07:30',
      actualTime: '2024-11-22 07:35',
      givenBy: 'Nurse Johnson',
      status: 'administered',
      notes: 'Taken with breakfast',
      sideEffects: ['Mild nausea']
    },
    {
      id: 4,
      patientId: 'P003',
      patientName: 'Maria Garcia',
      medicationName: 'Morphine',
      dosage: '4mg',
      route: 'IV',
      scheduledTime: '2024-11-22 12:00',
      actualTime: '2024-11-22 12:05',
      givenBy: 'Nurse Davis',
      status: 'administered',
      notes: 'Pain relief effective',
      sideEffects: ['Drowsiness']
    }
  ])

  const [scheduledMedications] = useState([
    {
      patientId: 'P001',
      patientName: 'John Anderson',
      medications: [
        { name: 'Lisinopril', dosage: '10mg', route: 'oral', time: '08:00', frequency: 'Once daily', status: 'due' },
        { name: 'Furosemide', dosage: '40mg', route: 'oral', time: '14:00', frequency: 'Once daily', status: 'pending' },
        { name: 'Aspirin', dosage: '81mg', route: 'oral', time: '20:00', frequency: 'Once daily', status: 'scheduled' }
      ]
    },
    {
      patientId: 'P002',
      patientName: 'Sarah Johnson',
      medications: [
        { name: 'Metformin', dosage: '500mg', route: 'oral', time: '07:30', frequency: 'Twice daily', status: 'overdue' },
        { name: 'Metformin', dosage: '500mg', route: 'oral', time: '19:30', frequency: 'Twice daily', status: 'scheduled' }
      ]
    },
    {
      patientId: 'P003',
      patientName: 'Maria Garcia',
      medications: [
        { name: 'Morphine', dosage: '4mg', route: 'IV', time: '12:00', frequency: 'Every 4 hours PRN', status: 'administered' },
        { name: 'Acetaminophen', dosage: '650mg', route: 'oral', time: '16:00', frequency: 'Every 6 hours', status: 'due' },
        { name: 'Omeprazole', dosage: '20mg', route: 'oral', time: '08:00', frequency: 'Once daily', status: 'administered' }
      ]
    }
  ])

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (e) => {
    setMedicationForm({
      ...medicationForm,
      [e.target.name]: e.target.value
    })
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setMedicationForm({
      ...medicationForm,
      patientId: patient.id
    })
    setShowMedicationForm(true)
  }

  const handleMedicationSelect = (medication) => {
    setMedicationForm({
      ...medicationForm,
      medicationName: medication.name
    })
  }

  const addSideEffect = () => {
    setMedicationForm({
      ...medicationForm,
      sideEffects: [...medicationForm.sideEffects, '']
    })
  }

  const updateSideEffect = (index, value) => {
    const updatedSideEffects = [...medicationForm.sideEffects]
    updatedSideEffects[index] = value
    setMedicationForm({
      ...medicationForm,
      sideEffects: updatedSideEffects
    })
  }

  const removeSideEffect = (index) => {
    const updatedSideEffects = medicationForm.sideEffects.filter((_, i) => i !== index)
    setMedicationForm({
      ...medicationForm,
      sideEffects: updatedSideEffects
    })
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleFileUpload = (e) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Please select a file to upload')
      return
    }
    console.log('Uploading medication file:', selectedFile.name)
    // TODO: Implement actual file upload API call
    alert(`Medication log "${selectedFile.name}" uploaded successfully!`)
    setShowUploadModal(false)
    setSelectedFile(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Recording medication administration:', medicationForm)
    alert('Medication administration recorded successfully!')
    setShowMedicationForm(false)
    setMedicationForm({
      patientId: '',
      medicationName: '',
      dosage: '',
      unit: 'mg',
      route: 'oral',
      frequency: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      scheduledTime: '',
      givenBy: '',
      status: 'pending',
      notes: '',
      sideEffects: []
    })
    setSelectedPatient(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'administered': return 'success'
      case 'pending': return 'warning'
      case 'due': return 'primary'
      case 'overdue': return 'danger'
      case 'scheduled': return 'secondary'
      case 'held': return 'warning'
      case 'refused': return 'danger'
      default: return 'secondary'
    }
  }

  const getMedicationStatusIcon = (status) => {
    switch (status) {
      case 'administered': return <CheckCircleIcon className="h-4 w-4" />
      case 'overdue': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'refused': return <XCircleIcon className="h-4 w-4" />
      case 'due': return <BellAlertIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medication Log</h1>
            <p className="text-gray-600 mt-1">Track medication administration and patient responses</p>
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
              variant={activeTab === 'schedule' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('schedule')}
            >
              <ClockIcon className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button
              variant={activeTab === 'log' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('log')}
            >
              <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
              Administration Log
            </Button>
            <Button
              onClick={() => setShowMedicationForm(true)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Record Administration
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
                <h2 className="text-xl font-semibold text-gray-900">Upload Medication Log File</h2>
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
                <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                  <div className="flex items-start">
                    <BeakerIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-900">Upload Instructions</h3>
                      <div className="mt-2 text-sm text-purple-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Upload CSV file with medication administration records</li>
                          <li>Required columns: patientId, medicationName, dosage, route, time</li>
                          <li>Optional columns: givenBy, notes, sideEffects</li>
                          <li>Maximum file size: 10MB</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Medication Log File
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <CloudArrowUpIcon className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">CSV files only (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        accept=".csv"
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

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> All medication records will be validated before import. Records with missing required fields will be flagged for review.
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
                  Upload and Process
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <Card>
            <Card.Header>
              <Card.Title>Today's Medication Schedule</Card.Title>
            </Card.Header>
            <Card.Content>
              {scheduledMedications.map((patient, patientIndex) => (
                <div key={patientIndex} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {patient.patientName} ({patient.patientId})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {patient.medications.map((med, medIndex) => (
                      <div
                        key={medIndex}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{med.name}</h4>
                          <Badge variant={getStatusColor(med.status)}>
                            <div className="flex items-center space-x-1">
                              {getMedicationStatusIcon(med.status)}
                              <span className="ml-1 capitalize">{med.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Dose:</span> {med.dosage} ({med.route})</p>
                          <p><span className="font-medium">Time:</span> {med.time}</p>
                          <p><span className="font-medium">Frequency:</span> {med.frequency}</p>
                        </div>
                        {(med.status === 'due' || med.status === 'overdue') && (
                          <Button
                            size="sm"
                            className="mt-3 w-full"
                            onClick={() => {
                              setMedicationForm({
                                ...medicationForm,
                                patientId: patient.patientId,
                                medicationName: med.name,
                                dosage: med.dosage,
                                route: med.route,
                                scheduledTime: med.time,
                                status: 'administered'
                              })
                              setShowMedicationForm(true)
                            }}
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Mark as Given
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      )}

      {activeTab === 'log' && (
        <div className="space-y-4">
          <Card>
            <Card.Header>
              <Card.Title>Medication Administration History</Card.Title>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dose & Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Given By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Side Effects</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {medicationLog.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{entry.patientName}</div>
                            <div className="text-gray-500">{entry.patientId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {entry.medicationName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {entry.dosage} ({entry.route})
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(entry.scheduledTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {entry.actualTime ? new Date(entry.actualTime).toLocaleString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {entry.givenBy || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={getStatusColor(entry.status)}>
                            <div className="flex items-center space-x-1">
                              {getMedicationStatusIcon(entry.status)}
                              <span className="ml-1 capitalize">{entry.status}</span>
                            </div>
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {entry.sideEffects.length > 0 ? entry.sideEffects.join(', ') : 'None'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {/* Medication Administration Modal */}
      {showMedicationForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Record Medication Administration
                  {selectedPatient && (
                    <span className="text-blue-600 ml-2">- {selectedPatient.name}</span>
                  )}
                </h2>
                <button
                  onClick={() => {
                    setShowMedicationForm(false)
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
                {/* Patient Selection and Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                    <input
                      type="text"
                      name="patientId"
                      value={medicationForm.patientId}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                    <input
                      type="text"
                      name="medicationName"
                      value={medicationForm.medicationName}
                      onChange={handleInputChange}
                      required
                      list="medications"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <datalist id="medications">
                      {commonMedications.map((med, index) => (
                        <option key={index} value={med.name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                      <input
                        type="text"
                        name="dosage"
                        value={medicationForm.dosage}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select
                        name="unit"
                        value={medicationForm.unit}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="mg">mg</option>
                        <option value="g">g</option>
                        <option value="mcg">mcg</option>
                        <option value="units">units</option>
                        <option value="mL">mL</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                      <select
                        name="route"
                        value={medicationForm.route}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="oral">Oral</option>
                        <option value="IV">IV</option>
                        <option value="IM">IM</option>
                        <option value="subcutaneous">Subcutaneous</option>
                        <option value="topical">Topical</option>
                        <option value="inhaled">Inhaled</option>
                        <option value="rectal">Rectal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      name="frequency"
                      value={medicationForm.frequency}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="Every 4 hours">Every 4 hours</option>
                      <option value="Every 6 hours">Every 6 hours</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                      <option value="Every 12 hours">Every 12 hours</option>
                      <option value="PRN">PRN (as needed)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
                      <input
                        type="time"
                        name="scheduledTime"
                        value={medicationForm.scheduledTime}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Given By</label>
                      <input
                        type="text"
                        name="givenBy"
                        value={medicationForm.givenBy}
                        onChange={handleInputChange}
                        placeholder="Nurse name"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Status and Side Effects */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Administration Status</label>
                    <select
                      name="status"
                      value={medicationForm.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="administered">Administered</option>
                      <option value="held">Held</option>
                      <option value="refused">Patient Refused</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={medicationForm.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Administration notes, patient response, etc."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Side Effects</label>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={addSideEffect}
                      >
                        Add Side Effect
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {medicationForm.sideEffects.map((sideEffect, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={sideEffect}
                            onChange={(e) => updateSideEffect(index, e.target.value)}
                            placeholder="e.g., Nausea, Dizziness"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeSideEffect(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      {medicationForm.sideEffects.length === 0 && (
                        <p className="text-gray-500 text-sm">No side effects recorded</p>
                      )}
                    </div>
                  </div>

                  {/* Common Medications Quick Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select Medication</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {commonMedications.map((med, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleMedicationSelect(med)}
                          className="p-2 text-left text-sm border border-gray-200 rounded hover:bg-blue-50 transition-colors"
                        >
                          <div className="font-medium">{med.name}</div>
                          <div className="text-gray-500 text-xs">
                            {med.dosages.slice(0, 3).join(', ')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Search Panel - Show when no patient selected */}
              {!medicationForm.patientId && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Select Patient</h3>
                  <div className="relative mb-4">
                    <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => handlePatientSelect(patient)}
                        className="p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-600">ID: {patient.id} • Room: {patient.room}</div>
                        <div className="text-xs text-gray-500">
                          Allergies: {patient.allergies.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowMedicationForm(false)
                    setSelectedPatient(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="inline-flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Record Administration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicationLog