import { useState } from 'react'
import { 
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  HeartIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const PatientProfile = () => {
  const [patient] = useState({
    id: 1,
    name: 'John Anderson',
    age: 67,
    gender: 'Male',
    dateOfBirth: '1957-03-15',
    phone: '(555) 123-4567',
    email: 'john.anderson@email.com',
    address: '123 Main St, City, State 12345',
    emergencyContact: {
      name: 'Jane Anderson',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    },
    primaryDoctor: 'Dr. Sarah Smith',
    condition: 'Hypertension, Type 2 Diabetes',
    riskScore: 89,
    lastVisit: '2024-11-19'
  })

  const [vitals] = useState([
    { date: '2024-11-21', bloodPressure: '145/92', heartRate: 78, temperature: 98.6, weight: 185 },
    { date: '2024-11-20', bloodPressure: '142/88', heartRate: 80, temperature: 98.4, weight: 185 },
    { date: '2024-11-19', bloodPressure: '138/85', heartRate: 75, temperature: 98.2, weight: 186 },
    { date: '2024-11-18', bloodPressure: '140/90', heartRate: 82, temperature: 98.5, weight: 186 }
  ])

  const [aiInsights] = useState([
    {
      id: 1,
      type: 'risk',
      title: 'Blood Pressure Trend Alert',
      message: 'Blood pressure has been consistently elevated over the past week. Consider medication adjustment.',
      severity: 'high',
      confidence: 94
    },
    {
      id: 2,
      type: 'anomaly',
      title: 'Heart Rate Variability',
      message: 'Heart rate patterns suggest possible medication compliance issues.',
      severity: 'medium',
      confidence: 78
    },
    {
      id: 3,
      type: 'prediction',
      title: 'Risk Assessment',
      message: 'Current trajectory suggests 23% increased risk of cardiovascular event in next 6 months.',
      severity: 'high',
      confidence: 87
    }
  ])

  const [timeline] = useState([
    {
      id: 1,
      type: 'consultation',
      title: 'Doctor Consultation',
      description: 'Routine checkup with Dr. Smith. Blood pressure medication adjusted.',
      date: '2024-11-19',
      time: '2:30 PM'
    },
    {
      id: 2,
      type: 'vitals',
      title: 'Vital Signs Updated',
      description: 'Blood pressure: 145/92, Heart rate: 78 BPM',
      date: '2024-11-19',
      time: '2:00 PM'
    },
    {
      id: 3,
      type: 'lab',
      title: 'Lab Results',
      description: 'Blood glucose levels within normal range. HbA1c: 6.8%',
      date: '2024-11-15',
      time: '9:00 AM'
    },
    {
      id: 4,
      type: 'medication',
      title: 'Medication Update',
      description: 'Metformin dosage increased to 1000mg twice daily',
      date: '2024-11-10',
      time: '11:30 AM'
    }
  ])

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'consultation': return UserIcon
      case 'vitals': return HeartIcon
      case 'lab': return DocumentTextIcon
      case 'medication': return ClockIcon
      default: return DocumentTextIcon
    }
  }

  return (
    <div className="space-y-6">
      {/* Patient Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{patient.age} years old</span>
                  <span>•</span>
                  <span>{patient.gender}</span>
                  <span>•</span>
                  <span>ID: {patient.id}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">AI Health Score</div>
              <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getRiskColor(patient.riskScore)}`}>
                {patient.riskScore}/100
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">Contact Information</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-900">{patient.phone}</p>
                <p className="text-sm text-gray-900">{patient.email}</p>
                <p className="text-sm text-gray-900">{patient.address}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">Medical Information</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-900">Primary: {patient.primaryDoctor}</p>
                <p className="text-sm text-gray-900">Conditions: {patient.condition}</p>
                <p className="text-sm text-gray-900">Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">Emergency Contact</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-900">{patient.emergencyContact.name}</p>
                <p className="text-sm text-gray-900">{patient.emergencyContact.phone}</p>
                <p className="text-sm text-gray-900">{patient.emergencyContact.relationship}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
                AI Insights
              </h3>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            insight.severity === 'high' ? 'bg-red-100 text-red-800' :
                            insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {insight.severity}
                          </span>
                          <span className="text-xs text-gray-500">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Vitals */}
          <div className="bg-white shadow rounded-lg mt-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <HeartIcon className="h-5 w-5 text-red-500 mr-2" />
                Recent Vitals
              </h3>
              <div className="space-y-3">
                {vitals.slice(0, 3).map((vital, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{new Date(vital.date).toLocaleDateString()}</p>
                        <p className="text-gray-600">BP: {vital.bloodPressure}</p>
                        <p className="text-gray-600">HR: {vital.heartRate} BPM</p>
                      </div>
                      <div className="text-sm text-right">
                        <p className="text-gray-600">Temp: {vital.temperature}°F</p>
                        <p className="text-gray-600">Weight: {vital.weight} lbs</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 text-green-500 mr-2" />
                Patient Timeline
              </h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {timeline.map((event, index) => {
                    const Icon = getTimelineIcon(event.type)
                    return (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {index !== timeline.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                event.type === 'consultation' ? 'bg-blue-500' :
                                event.type === 'vitals' ? 'bg-red-500' :
                                event.type === 'lab' ? 'bg-green-500' : 'bg-purple-500'
                              }`}>
                                <Icon className="h-4 w-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                              </div>
                              <div className="mt-2 text-sm text-gray-500">
                                <time>{new Date(event.date).toLocaleDateString()} at {event.time}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientProfile