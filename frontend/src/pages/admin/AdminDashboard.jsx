import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [stats] = useState({
    totalPatients: 1247,
    activeStaff: 89,
    todayRegistrations: 23,
    systemAlerts: 5
  })

  const [recentActivity] = useState([
    { id: 1, type: 'registration', message: 'New patient registered: John Smith', time: '10 minutes ago' },
    { id: 2, type: 'alert', message: 'System backup completed successfully', time: '1 hour ago' },
    { id: 3, type: 'upload', message: 'Bulk CSV upload processed: 150 records', time: '2 hours ago' },
    { id: 4, type: 'staff', message: 'New doctor account created: Dr. Sarah Wilson', time: '3 hours ago' }
  ])

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleBulkUpload = (e) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Please select a file to upload')
      return
    }
    console.log('Uploading file:', selectedFile.name)
    // TODO: Implement actual bulk upload API call
    alert(`File "${selectedFile.name}" uploaded successfully!`)
    setShowBulkUpload(false)
    setSelectedFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage patients, staff, and system operations</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/admin/patients')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Register Patient
            </button>
            <button 
              onClick={() => setShowBulkUpload(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
              Bulk Upload
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Bulk Patient Upload</h2>
                <button
                  onClick={() => {
                    setShowBulkUpload(false)
                    setSelectedFile(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleBulkUpload} className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start">
                    <DocumentArrowUpIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-900">Upload Instructions</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Upload a CSV file with patient information</li>
                          <li>Required columns: firstName, lastName, dateOfBirth, gender, phone, email</li>
                          <li>Optional columns: address, emergencyContact, medicalHistory, allergies</li>
                          <li>Maximum file size: 10MB</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select CSV File
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <DocumentArrowUpIcon className="h-8 w-8 text-gray-400 mb-2" />
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
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <DocumentArrowUpIcon className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium">{selectedFile.name}</span>
                      <span className="ml-2 text-gray-400">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This will validate and import all patient records. Duplicate entries will be skipped.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkUpload(false)
                    setSelectedFile(null)
                  }}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Upload and Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Patients</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalPatients.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500"> from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Staff</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeStaff}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+3</span>
              <span className="text-gray-500"> new this week</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Registrations</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.todayRegistrations}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-blue-600 font-medium">Above average</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">System Alerts</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.systemAlerts}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-red-600 font-medium">2 critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== recentActivity.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          activity.type === 'alert' ? 'bg-red-500' :
                          activity.type === 'registration' ? 'bg-green-500' :
                          activity.type === 'upload' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                          {activity.type === 'registration' && <UserGroupIcon className="h-4 w-4 text-white" />}
                          {activity.type === 'alert' && <ExclamationTriangleIcon className="h-4 w-4 text-white" />}
                          {activity.type === 'upload' && <ClipboardDocumentListIcon className="h-4 w-4 text-white" />}
                          {activity.type === 'staff' && <UserGroupIcon className="h-4 w-4 text-white" />}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">{activity.message}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard