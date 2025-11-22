import { useState, useEffect } from 'react'
import { PlusIcon, MagnifyingGlassIcon, UserGroupIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import staffService from '../../services/staffService'
import { useAuth } from '../../context/AuthContext'

const StaffManagement = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [editingStaff, setEditingStaff] = useState(null)
  const [staff, setStaff] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showStaffDetails, setShowStaffDetails] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  
  const { user, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    licenseNumber: '',
    specialization: '',
    dateOfJoining: '',
    address: '',
    employeeId: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setError('You must be logged in to access staff management.')
      return
    }
  }, [isAuthenticated])

  // Load staff data
  const loadStaff = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await staffService.getStaff()
      if (response.success) {
        setStaff(response.staff || [])
      }
    } catch (err) {
      setError('Failed to load staff: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await staffService.getStaffStatistics()
      if (response.success) {
        setStatistics(response.statistics)
      }
    } catch (err) {
      console.error('Failed to load statistics:', err)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadStaff()
      loadStatistics()
    }
  }, [isAuthenticated])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      setError('You must be logged in to register staff.')
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    
    try {
      if (editingStaff) {
        // Update existing staff
        const response = await staffService.updateStaff(editingStaff.id, formData)
        if (response.success) {
          setSuccessMessage('Staff member updated successfully!')
        }
      } else {
        // Register new staff
        const response = await staffService.registerStaff(formData)
        if (response.success) {
          setSuccessMessage('Staff member registered successfully!')
        }
      }
      
      setShowRegistrationForm(false)
      setEditingStaff(null)
      resetForm()
      await loadStaff()
      await loadStatistics()
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      licenseNumber: '',
      specialization: '',
      dateOfJoining: '',
      address: '',
      employeeId: '',
      emergencyContact: '',
      emergencyPhone: ''
    })
  }

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember)
    setFormData({
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
      email: staffMember.email,
      phone: staffMember.phone,
      role: staffMember.role,
      department: staffMember.department,
      specialization: staffMember.specialization,
      employeeId: staffMember.employeeId,
      licenseNumber: staffMember.licenseNumber,
      dateOfJoining: staffMember.dateOfJoining,
      address: staffMember.address || '',
      emergencyContact: staffMember.emergencyContactName || '',
      emergencyPhone: staffMember.emergencyContactPhone || ''
    })
    setShowRegistrationForm(true)
  }

  const handleViewStaff = (staffMember) => {
    setSelectedStaff(staffMember)
    setShowStaffDetails(true)
  }

  const handleDelete = async (staffMember) => {
    if (!window.confirm(`Are you sure you want to delete ${staffMember.fullName}?`)) {
      return
    }
    
    try {
      setIsLoading(true)
      setError('')
      setSuccessMessage('')
      
      const response = await staffService.deleteStaff(staffMember.id)
      if (response.success) {
        setSuccessMessage('Staff member deleted successfully!')
        await loadStaff()
        await loadStatistics()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === '' || member.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role) => {
    switch (role) {
      case 'Doctor': return 'primary'
      case 'Nurse': return 'success'
      case 'Admin': return 'warning'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Register and manage healthcare staff members</p>
          </div>
          <Button
            onClick={() => {
              setEditingStaff(null)
              resetForm()
              setShowRegistrationForm(true)
            }}
            className="inline-flex items-center"
            disabled={isLoading}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Staff Member
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{statistics?.total || staff.length}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{statistics?.by_role?.Doctor || staff.filter(s => s.role === 'Doctor').length}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nurses</p>
                <p className="text-2xl font-bold text-gray-900">{statistics?.by_role?.Nurse || staff.filter(s => s.role === 'Nurse').length}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">{statistics?.by_status?.Active || staff.filter(s => s.status === 'Active').length}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingStaff ? 'Edit Staff Member' : 'Register New Staff Member'}
                </h2>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="DOC001, NUR001, ADM001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Role</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Emergency">Emergency</option>
                      <option value="ICU">ICU</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Professional license number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={formData.dateOfJoining}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
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
                  {isLoading ? (
                    editingStaff ? 'Updating...' : 'Registering...'
                  ) : (
                    editingStaff ? 'Update Staff Member' : 'Register Staff Member'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff List */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title className="flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Staff Members ({filteredStaff.length})
            </Card.Title>
            <div className="flex items-center space-x-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="Doctor">Doctors</option>
                <option value="Nurse">Nurses</option>
                <option value="Admin">Admin</option>
                <option value="Technician">Technicians</option>
              </select>
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
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
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Loading staff...
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No staff members found
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {member.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.fullName}</div>
                            <div className="text-sm text-gray-500">ID: {member.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.phone}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <Badge variant={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                          <div className="text-sm text-gray-500">{member.department}</div>
                          <div className="text-xs text-gray-400">{member.specialization}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.patientsAssigned || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewStaff(member)}
                          className="text-green-600 hover:text-green-900 mr-3 p-1 rounded hover:bg-green-50"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-900 mr-3 p-1 rounded hover:bg-blue-50"
                          title="Edit Staff"
                          disabled={isLoading}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete Staff"
                          disabled={isLoading}
                        >
                          <TrashIcon className="h-4 w-4" />
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

      {/* Staff Details Modal */}
      {showStaffDetails && selectedStaff && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Staff Details</h2>
                <button
                  onClick={() => setShowStaffDetails(false)}
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
                      <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                      <p className="text-sm text-gray-900">{selectedStaff.employeeId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-sm text-gray-900">{selectedStaff.fullName}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-sm text-gray-900">{selectedStaff.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-sm text-gray-900">{selectedStaff.phone}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900">{selectedStaff.address || 'N/A'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Emergency Contact</label>
                      <p className="text-sm text-gray-900">{selectedStaff.emergencyContactName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Emergency Phone</label>
                      <p className="text-sm text-gray-900">{selectedStaff.emergencyContactPhone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Professional Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Role</label>
                      <Badge variant={getRoleColor(selectedStaff.role)}>
                        {selectedStaff.role}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Department</label>
                      <p className="text-sm text-gray-900">{selectedStaff.department}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Specialization</label>
                    <p className="text-sm text-gray-900">{selectedStaff.specialization || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">License Number</label>
                    <p className="text-sm text-gray-900">{selectedStaff.licenseNumber || 'N/A'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date of Joining</label>
                      <p className="text-sm text-gray-900">{selectedStaff.dateOfJoining ? new Date(selectedStaff.dateOfJoining).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status</label>
                      <Badge variant={selectedStaff.status === 'Active' ? 'success' : 'warning'}>
                        {selectedStaff.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Patients Assigned</label>
                    <p className="text-sm text-gray-900">{selectedStaff.patientsAssigned || 0}</p>
                  </div>
                </div>
              </div>

              {/* Registration Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-sm text-gray-900">{selectedStaff.createdAt ? new Date(selectedStaff.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm text-gray-900">{selectedStaff.updatedAt ? new Date(selectedStaff.updatedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowStaffDetails(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowStaffDetails(false)
                    handleEdit(selectedStaff)
                  }}
                >
                  Edit Staff
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffManagement