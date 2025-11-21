import { useState } from 'react'
import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const DoctorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [highRiskPatients] = useState([
    { id: 1, name: 'John Anderson', age: 67, condition: 'Hypertension', riskScore: 89, lastVisit: '2 days ago' },
    { id: 2, name: 'Maria Garcia', age: 54, condition: 'Diabetes', riskScore: 76, lastVisit: '1 week ago' },
    { id: 3, name: 'Robert Chen', age: 72, condition: 'Heart Disease', riskScore: 84, lastVisit: '3 days ago' }
  ])

  const [recentInsights] = useState([
    { id: 1, patient: 'John Anderson', insight: 'Blood pressure trending upward - consider medication adjustment', severity: 'high' },
    { id: 2, patient: 'Sarah Johnson', insight: 'Lab results show improvement in glucose levels', severity: 'low' },
    { id: 3, patient: 'Maria Garcia', insight: 'Missed medication doses detected from vitals pattern', severity: 'medium' }
  ])

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-1">AI-powered patient insights and risk monitoring</p>
          </div>
        </div>
        
        {/* Smart Search */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Smart search: 'Show patients with rising blood pressure' or enter patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <UserIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">My Patients</dt>
                  <dd className="text-lg font-medium text-gray-900">127</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">High Risk</dt>
                  <dd className="text-lg font-medium text-gray-900">8</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Reviews</dt>
                  <dd className="text-lg font-medium text-gray-900">15</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <ChartBarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">AI Insights</dt>
                  <dd className="text-lg font-medium text-gray-900">23</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Risk Patients */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              High Risk Patients
            </h3>
            <div className="space-y-4">
              {highRiskPatients.map((patient) => (
                <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-500">Age {patient.age} • {patient.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.riskScore >= 80 ? 'bg-red-100 text-red-800' :
                        patient.riskScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        Risk: {patient.riskScore}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
              Latest AI Insights
            </h3>
            <div className="space-y-4">
              {recentInsights.map((insight) => (
                <div key={insight.id} className="border-l-4 pl-4 py-2 border-gray-200 hover:border-blue-500 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{insight.patient}</p>
                      <p className="text-sm text-gray-600 mt-1">{insight.insight}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      insight.severity === 'high' ? 'bg-red-100 text-red-800' :
                      insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Advanced Patient Search</p>
                <p className="text-sm text-gray-500">Natural language queries</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center">
              <ChartBarIcon className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Risk Analytics</p>
                <p className="text-sm text-gray-500">View risk trends</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Patient Notes</p>
                <p className="text-sm text-gray-500">Add consultation notes</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard