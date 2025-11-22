import { useState, useEffect } from 'react'
import { PlusIcon, MagnifyingGlassIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import patientService from '../../services/patientService'
import { useAuth } from '../../context/AuthContext'

const PatientRegistration = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    patientId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    insuranceProvider: '',
    insuranceNumber: ''
  })
  
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showPatientDetails, setShowPatientDetails] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  
  const { user, isAuthenticated } = useAuth()

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setError('You must be logged in to access patient registration.')
      return
    }
  }, [isAuthenticated])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowPatientDetails(true)
  }

  const loadPatients = async () => {
    try {
      setIsLoading(true)
      const response = await patientService.getPatients()
      
      if (response.success && response.patients) {
        // Transform backend data to match frontend format
        const transformedPatients = response.patients.map(patient => ({
          id: patient.id,
          name: patient.fullName,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          emergencyContactName: patient.emergencyContactName,
          emergencyContactPhone: patient.emergencyContactPhone,
          medicalHistory: patient.medicalHistory,
          currentMedications: patient.currentMedications,
          allergies: patient.allergies,
          insuranceProvider: patient.insuranceProvider,
          insuranceNumber: patient.insuranceNumber,
          condition: 'General', // Default since we don't have condition in our model
          registeredDate: patient.createdAt ? new Date(patient.createdAt).toISOString().split('T')[0] : '',
          status: 'Active', // Default status
          lastVisit: patient.createdAt ? new Date(patient.createdAt).toISOString().split('T')[0] : '',
          patientId: patient.medicalRecordNumber || patient.patientId
        }))
        
        setPatients(transformedPatients)
      }
    } catch (err) {
      setError('Failed to load patients: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check authentication first
    if (!isAuthenticated) {
      setError('You must be logged in to register a patient.')
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    
    try {
      console.log('Attempting to register patient:', formData)
      console.log('User authenticated:', isAuthenticated)
      console.log('Token exists:', !!localStorage.getItem('token'))
      
      const response = await patientService.registerPatient(formData)
      
      if (response.success) {
        setSuccessMessage('Patient registered successfully!')
        setShowRegistrationForm(false)
        setFormData({
          patientId: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          phone: '',
          email: '',
          address: '',
          emergencyContact: '',
          emergencyPhone: '',
          medicalHistory: '',
          currentMedications: '',
          allergies: '',
          insuranceProvider: '',
          insuranceNumber: ''
        })
        
        // Refresh patients list
        await loadPatients()
      }
    } catch (err) {
      console.error('Patient registration error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.patientId && patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Debug Info (remove in production) */}
      {/* <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md text-sm">
        <strong>Debug Info:</strong> 
        User: {user?.email || 'Not logged in'} | 
        Role: {user?.role || 'N/A'} | 
        Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}
      </div> */}

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Registration</h1>
            <p className="text-gray-600 mt-1">Register new patients and manage patient records</p>
          </div>
          <Button
            onClick={() => setShowRegistrationForm(true)}
            className="inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Register New Patient
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Register New Patient</h2>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                    <input
                      type="text"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., PAT-001"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows="2"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Medical & Emergency Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Emergency Contact & Medical Info</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Previous surgeries, chronic conditions, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                    <textarea
                      name="currentMedications"
                      value={formData.currentMedications}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="List current medications and dosages"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Drug allergies, food allergies, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                    <input
                      type="text"
                      name="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Number</label>
                    <input
                      type="text"
                      name="insuranceNumber"
                      value={formData.insuranceNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={() => setShowRegistrationForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register Patient'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient List */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title className="flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Registered Patients ({filteredPatients.length})
            </Card.Title>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Loading patients...
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.patientId || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">Age {patient.age || 'N/A'} • {patient.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.phone}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.condition}</div>
                        <div className="text-sm text-gray-500">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={patient.status === 'Active' ? 'success' : 'default'}>
                          {patient.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(patient.registeredDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewPatient(patient)}
                          className="text-blue-600 hover:text-blue-900 mr-3 p-1 rounded hover:bg-blue-50"
                          title="View Patient Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Patient Details</h2>
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Patient ID</label>
                      <p className="text-sm text-gray-900">{selectedPatient.patientId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-sm text-gray-900">{selectedPatient.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Age</label>
                      <p className="text-sm text-gray-900">{selectedPatient.age || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-sm text-gray-900">{selectedPatient.gender}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-sm text-gray-900">{selectedPatient.phone}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-sm text-gray-900">{selectedPatient.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900">{selectedPatient.address || 'N/A'}</p>
                  </div>
                </div>

                {/* Medical & Emergency Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Medical & Emergency Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Emergency Contact</label>
                    <p className="text-sm text-gray-900">{selectedPatient.emergencyContactName || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Emergency Phone</label>
                    <p className="text-sm text-gray-900">{selectedPatient.emergencyContactPhone || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Medical History</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {selectedPatient.medicalHistory || 'No medical history recorded'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Current Medications</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {selectedPatient.currentMedications || 'No current medications recorded'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Allergies</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {selectedPatient.allergies || 'No allergies recorded'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Insurance Provider</label>
                      <p className="text-sm text-gray-900">{selectedPatient.insuranceProvider || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Insurance Number</label>
                      <p className="text-sm text-gray-900">{selectedPatient.insuranceNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-sm text-gray-900">{new Date(selectedPatient.registeredDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <Badge variant={selectedPatient.status === 'Active' ? 'success' : 'default'}>
                      {selectedPatient.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Visit</label>
                    <p className="text-sm text-gray-900">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowPatientDetails(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Future: Add edit functionality
                    console.log('Edit patient:', selectedPatient)
                  }}
                >
                  Edit Patient
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientRegistration