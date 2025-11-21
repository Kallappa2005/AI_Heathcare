import { useState } from 'react'
import { 
  DocumentArrowUpIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  UserGroupIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'

const NurseDashboard = () => {
  const [recentUploads] = useState([
    { id: 1, type: 'vitals', patient: 'John Anderson', file: 'vitals_2024-11-21.csv', time: '30 minutes ago' },
    { id: 2, type: 'lab', patient: 'Maria Garcia', file: 'lab_results_blood.pdf', time: '1 hour ago' },
    { id: 3, type: 'medication', patient: 'Robert Chen', file: 'medication_log.csv', time: '2 hours ago' }
  ])

  const [todayTasks] = useState([
    { id: 1, task: 'Upload vitals for Room 301-305', completed: true },
    { id: 2, task: 'Process lab results (12 pending)', completed: false },
    { id: 3, task: 'Update medication schedules', completed: false },
    { id: 4, task: 'Review flagged patient alerts', completed: true }
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage patient vitals, lab results, and medication tracking</p>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
              Upload Vitals
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
              <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
              Add Lab Results
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <UserGroupIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Assigned Patients</dt>
                  <dd className="text-lg font-medium text-gray-900">32</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <DocumentArrowUpIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Uploads</dt>
                  <dd className="text-lg font-medium text-gray-900">18</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <HeartIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Vital Alerts</dt>
                  <dd className="text-lg font-medium text-gray-900">3</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <ClipboardDocumentListIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Labs</dt>
                  <dd className="text-lg font-medium text-gray-900">7</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Upload</h3>
            
            {/* Upload Areas */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition-colors">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">Upload Patient Vitals</p>
                  <p className="text-sm text-gray-500">CSV files with blood pressure, temperature, heart rate</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 cursor-pointer transition-colors">
                <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">Upload Lab Results</p>
                  <p className="text-sm text-gray-500">PDF reports from laboratory tests</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 cursor-pointer transition-colors">
                <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">Medication Updates</p>
                  <p className="text-sm text-gray-500">Update medication schedules and dosages</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Uploads</h3>
            <div className="space-y-4">
              {recentUploads.map((upload) => (
                <div key={upload.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    upload.type === 'vitals' ? 'bg-blue-100' :
                    upload.type === 'lab' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {upload.type === 'vitals' && <DocumentArrowUpIcon className="h-5 w-5 text-blue-600" />}
                    {upload.type === 'lab' && <ClipboardDocumentListIcon className="h-5 w-5 text-green-600" />}
                    {upload.type === 'medication' && <HeartIcon className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{upload.patient}</p>
                    <p className="text-sm text-gray-500 truncate">{upload.file}</p>
                  </div>
                  <div className="shrink-0 text-sm text-gray-500">
                    {upload.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Today's Tasks</h3>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className={`text-sm ${
                  task.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                }`}>
                  {task.task}
                </span>
                {task.completed && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center">
              <CloudArrowUpIcon className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Bulk CSV Upload</p>
                <p className="text-sm text-gray-500">Upload multiple patient files</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center">
              <HeartIcon className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Emergency Vitals</p>
                <p className="text-sm text-gray-500">Quick vital sign entry</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Patient Reports</p>
                <p className="text-sm text-gray-500">Generate daily reports</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NurseDashboard