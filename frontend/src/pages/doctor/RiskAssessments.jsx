import { useState } from 'react'
import { 
  ExclamationTriangleIcon, 
  ChartBarIcon, 
  UserIcon, 
  HeartIcon,
  ClockIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const RiskAssessments = () => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedTool, setSelectedTool] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')

  const [patients] = useState([
    {
      id: 1,
      name: 'John Anderson',
      age: 67,
      condition: 'Hypertension',
      overallRisk: 89,
      riskHistory: [85, 87, 89, 91, 89],
      lastAssessment: '2024-11-20',
      riskFactors: {
        cardiac: 85,
        fall: 45,
        bleeding: 72,
        readmission: 68
      },
      assessments: [
        { date: '2024-11-20', type: 'Cardiac Risk', score: 85, trend: 'up' },
        { date: '2024-11-15', type: 'Fall Risk', score: 45, trend: 'stable' },
        { date: '2024-11-10', type: 'Bleeding Risk', score: 72, trend: 'down' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      age: 34,
      condition: 'Diabetes Type 2',
      overallRisk: 76,
      riskHistory: [80, 78, 76, 74, 76],
      lastAssessment: '2024-11-19',
      riskFactors: {
        cardiac: 65,
        fall: 25,
        bleeding: 35,
        readmission: 45
      },
      assessments: [
        { date: '2024-11-19', type: 'Cardiac Risk', score: 65, trend: 'down' },
        { date: '2024-11-12', type: 'Readmission Risk', score: 45, trend: 'stable' }
      ]
    },
    {
      id: 3,
      name: 'Robert Chen',
      age: 72,
      condition: 'COPD',
      overallRisk: 84,
      riskHistory: [82, 83, 84, 86, 84],
      lastAssessment: '2024-11-17',
      riskFactors: {
        cardiac: 78,
        fall: 65,
        bleeding: 55,
        readmission: 82
      },
      assessments: [
        { date: '2024-11-17', type: 'Readmission Risk', score: 82, trend: 'up' },
        { date: '2024-11-10', type: 'Fall Risk', score: 65, trend: 'up' }
      ]
    }
  ])

  const [riskTools] = useState([
    {
      id: 'cardiac',
      name: 'Cardiac Risk Assessment',
      description: 'ASCVD Risk Calculator for 10-year cardiovascular disease risk',
      factors: ['Age', 'Gender', 'Total Cholesterol', 'HDL', 'Blood Pressure', 'Diabetes', 'Smoking']
    },
    {
      id: 'fall',
      name: 'Fall Risk Assessment',
      description: 'Morse Fall Scale for hospitalized patients',
      factors: ['History of falling', 'Secondary diagnosis', 'Ambulatory aid', 'IV/Heparin', 'Gait', 'Mental status']
    },
    {
      id: 'bleeding',
      name: 'Bleeding Risk Assessment',
      description: 'HAS-BLED Score for bleeding risk in anticoagulation',
      factors: ['Hypertension', 'Abnormal kidney/liver', 'Stroke', 'Bleeding', 'Labile INR', 'Elderly', 'Drugs/alcohol']
    },
    {
      id: 'readmission',
      name: 'Hospital Readmission Risk',
      description: 'LACE Index for 30-day readmission risk',
      factors: ['Length of stay', 'Acuity of admission', 'Charlson comorbidity', 'Emergency visits']
    }
  ])

  const getRiskColor = (score) => {
    if (score >= 80) return 'danger'
    if (score >= 60) return 'warning'
    return 'success'
  }

  const getRiskLevel = (score) => {
    if (score >= 80) return 'High'
    if (score >= 60) return 'Medium'
    return 'Low'
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return ArrowTrendingUpIcon
    if (trend === 'down') return ArrowTrendingDownIcon
    return ClockIcon
  }

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-red-500'
    if (trend === 'down') return 'text-green-500'
    return 'text-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Risk Assessments</h1>
            <p className="text-gray-600 mt-1">Comprehensive risk analysis and monitoring for patients</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant={activeTab === 'dashboard' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('dashboard')}
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'calculator' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('calculator')}
            >
              <CalculatorIcon className="h-4 w-4 mr-2" />
              Risk Calculator
            </Button>
          </div>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Patient Risk Overview
                </Card.Title>
              </Card.Header>
              <Card.Content className="p-0">
                <div className="space-y-1">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-4 cursor-pointer transition-colors border-l-4 ${
                        selectedPatient?.id === patient.id
                          ? 'bg-blue-50 border-blue-500'
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                        <Badge variant={getRiskColor(patient.overallRisk)}>
                          {patient.overallRisk}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Age {patient.age} • {patient.condition}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Overall Risk</span>
                          <span>{getRiskLevel(patient.overallRisk)} Risk</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              patient.overallRisk >= 80 ? 'bg-red-500' :
                              patient.overallRisk >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${patient.overallRisk}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Patient Risk Details */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Risk Factors Breakdown */}
                <Card>
                  <Card.Header>
                    <Card.Title className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                      Risk Factors - {selectedPatient.name}
                    </Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Cardiac Risk</span>
                            <span className="text-sm text-gray-600">{selectedPatient.riskFactors.cardiac}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                selectedPatient.riskFactors.cardiac >= 80 ? 'bg-red-500' :
                                selectedPatient.riskFactors.cardiac >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${selectedPatient.riskFactors.cardiac}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Fall Risk</span>
                            <span className="text-sm text-gray-600">{selectedPatient.riskFactors.fall}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                selectedPatient.riskFactors.fall >= 80 ? 'bg-red-500' :
                                selectedPatient.riskFactors.fall >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${selectedPatient.riskFactors.fall}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Bleeding Risk</span>
                            <span className="text-sm text-gray-600">{selectedPatient.riskFactors.bleeding}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                selectedPatient.riskFactors.bleeding >= 80 ? 'bg-red-500' :
                                selectedPatient.riskFactors.bleeding >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${selectedPatient.riskFactors.bleeding}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Readmission Risk</span>
                            <span className="text-sm text-gray-600">{selectedPatient.riskFactors.readmission}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                selectedPatient.riskFactors.readmission >= 80 ? 'bg-red-500' :
                                selectedPatient.riskFactors.readmission >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${selectedPatient.riskFactors.readmission}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>

                {/* Risk Trend */}
                <Card>
                  <Card.Header>
                    <Card.Title className="flex items-center">
                      <ChartBarIcon className="h-5 w-5 mr-2" />
                      Risk Trend (Last 5 Assessments)
                    </Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="flex items-end space-x-2 h-32">
                      {selectedPatient.riskHistory.map((risk, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t ${
                              risk >= 80 ? 'bg-red-500' :
                              risk >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ height: `${(risk / 100) * 80}px` }}
                          ></div>
                          <span className="text-xs text-gray-600 mt-1">{risk}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>5 weeks ago</span>
                      <span>Current</span>
                    </div>
                  </Card.Content>
                </Card>

                {/* Recent Assessments */}
                <Card>
                  <Card.Header>
                    <Card.Title>Recent Risk Assessments</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      {selectedPatient.assessments.map((assessment, index) => {
                        const TrendIcon = getTrendIcon(assessment.trend)
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <HeartIcon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{assessment.type}</h4>
                                <p className="text-sm text-gray-600">{assessment.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant={getRiskColor(assessment.score)}>
                                {assessment.score}%
                              </Badge>
                              <TrendIcon className={`h-4 w-4 ${getTrendColor(assessment.trend)}`} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card.Content>
                </Card>
              </div>
            ) : (
              <Card>
                <Card.Content className="text-center py-12">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                  <p className="text-gray-600">Choose a patient to view detailed risk analysis</p>
                </Card.Content>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Assessment Tools */}
          <div>
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <CalculatorIcon className="h-5 w-5 mr-2" />
                  Risk Assessment Tools
                </Card.Title>
              </Card.Header>
              <Card.Content className="p-0">
                <div className="space-y-1">
                  {riskTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`p-4 cursor-pointer transition-colors border-l-4 ${
                        selectedTool === tool.id
                          ? 'bg-blue-50 border-blue-500'
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900 mb-1">{tool.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {tool.factors.slice(0, 3).map((factor, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                        {tool.factors.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tool.factors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Calculator Interface */}
          <div>
            {selectedTool ? (
              <Card>
                <Card.Header>
                  <Card.Title>
                    {riskTools.find(tool => tool.id === selectedTool)?.name}
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                          <option key={patient.id} value={patient.name}>{patient.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Assessment Factors</h4>
                      {riskTools.find(tool => tool.id === selectedTool)?.factors.map((factor, index) => (
                        <div key={index} className="space-y-1">
                          <label className="block text-sm text-gray-700">{factor}</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter value"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Button className="w-full">
                        <CalculatorIcon className="h-4 w-4 mr-2" />
                        Calculate Risk Score
                      </Button>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Risk Score Result</h4>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">--</div>
                        <p className="text-sm text-blue-700">Complete assessment to see result</p>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ) : (
              <Card>
                <Card.Content className="text-center py-12">
                  <CalculatorIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Assessment Tool</h3>
                  <p className="text-gray-600">Choose a risk assessment tool to begin calculation</p>
                </Card.Content>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RiskAssessments