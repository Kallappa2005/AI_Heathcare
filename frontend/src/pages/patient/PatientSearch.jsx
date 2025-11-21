import { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const PatientSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    ageRange: '',
    condition: '',
    riskLevel: '',
    lastVisit: ''
  })

  const [patients] = useState([
    { 
      id: 1, 
      name: 'John Anderson', 
      age: 67, 
      condition: 'Hypertension', 
      riskScore: 89, 
      lastVisit: '2024-11-19',
      phone: '(555) 123-4567',
      doctor: 'Dr. Smith'
    },
    { 
      id: 2, 
      name: 'Maria Garcia', 
      age: 54, 
      condition: 'Diabetes Type 2', 
      riskScore: 76, 
      lastVisit: '2024-11-14',
      phone: '(555) 234-5678',
      doctor: 'Dr. Johnson'
    },
    { 
      id: 3, 
      name: 'Robert Chen', 
      age: 72, 
      condition: 'Heart Disease', 
      riskScore: 84, 
      lastVisit: '2024-11-18',
      phone: '(555) 345-6789',
      doctor: 'Dr. Wilson'
    },
    { 
      id: 4, 
      name: 'Sarah Johnson', 
      age: 45, 
      condition: 'Asthma', 
      riskScore: 32, 
      lastVisit: '2024-11-20',
      phone: '(555) 456-7890',
      doctor: 'Dr. Brown'
    }
  ])

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getRiskBadge = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getRiskText = (score) => {
    if (score >= 80) return 'High Risk'
    if (score >= 60) return 'Medium Risk'
    return 'Low Risk'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Search</h1>
            <p className="text-gray-600 mt-1">Find patients using smart search or filters</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, condition, or use natural language: 'patients with high blood pressure'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Natural Language Search Examples */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Try natural language searches:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Show patients with diabetes',
                'High risk patients',
                'Patients over 60',
                'Recent visits this week'
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setSearchQuery(example)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.ageRange}
                    onChange={(e) => setFilters({...filters, ageRange: e.target.value})}
                  >
                    <option value="">All ages</option>
                    <option value="18-30">18-30</option>
                    <option value="31-50">31-50</option>
                    <option value="51-70">51-70</option>
                    <option value="70+">70+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.condition}
                    onChange={(e) => setFilters({...filters, condition: e.target.value})}
                  >
                    <option value="">All conditions</option>
                    <option value="diabetes">Diabetes</option>
                    <option value="hypertension">Hypertension</option>
                    <option value="heart-disease">Heart Disease</option>
                    <option value="asthma">Asthma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.riskLevel}
                    onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
                  >
                    <option value="">All risk levels</option>
                    <option value="low">Low Risk (0-59)</option>
                    <option value="medium">Medium Risk (60-79)</option>
                    <option value="high">High Risk (80+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.lastVisit}
                    onChange={(e) => setFilters({...filters, lastVisit: e.target.value})}
                  >
                    <option value="">Any time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                    <option value="quarter">This quarter</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results ({filteredPatients.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredPatients.map((patient) => (
              <Link
                key={patient.id}
                to={`/patients/${patient.id}`}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-700">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{patient.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Age {patient.age}</span>
                        <span>•</span>
                        <span>{patient.condition}</span>
                        <span>•</span>
                        <span>{patient.phone}</span>
                        <span>•</span>
                        <span>Dr: {patient.doctor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Last visit</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">AI Risk Score</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadge(patient.riskScore)}`}>
                        {getRiskText(patient.riskScore)} ({patient.riskScore})
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search query or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientSearch