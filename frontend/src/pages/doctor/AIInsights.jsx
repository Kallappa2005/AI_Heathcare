import { useState } from 'react'
import { 
  UserIcon, 
  BoltIcon, 
  ExclamationTriangleIcon, 
  HeartIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const AIInsights = () => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [assignedPatients] = useState([
    {
      id: 1,
      name: 'John Anderson',
      age: 67,
      condition: 'Hypertension',
      riskScore: 89,
      lastVisit: '2024-11-20',
      aiSummary: 'High-risk cardiac patient with recent blood pressure elevation. AI analysis suggests medication adjustment needed.',
      keyTerms: ['Hypertension', 'Beta-blockers', 'ECG abnormal', 'Chest pain'],
      latestVitals: { bp: '168/95', hr: '88', temp: '98.6' },
      insights: {
        riskFactors: ['Elevated blood pressure trending upward', 'Family history of cardiac events', 'Age-related cardiovascular changes'],
        recommendations: ['Consider ACE inhibitor adjustment', 'Schedule cardiology consultation', 'Monitor daily BP readings'],
        aiReasoning: 'Risk score elevated due to systolic BP >160 for 3 consecutive visits, combined with patient age and family history. AI model confidence: 94%'
      }
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      age: 34,
      condition: 'Diabetes Type 2',
      riskScore: 76,
      lastVisit: '2024-11-19',
      aiSummary: 'Diabetes management improving with recent HbA1c reduction. Continue current treatment protocol.',
      keyTerms: ['Diabetes', 'Metformin', 'HbA1c', 'Glucose monitoring'],
      latestVitals: { glucose: '142', bp: '128/82', hr: '72', temp: '98.2' },
      insights: {
        riskFactors: ['HbA1c trending downward but still above target', 'Occasional missed medication doses', 'Stress-related glucose spikes'],
        recommendations: ['Continue metformin 1000mg BID', 'Referral to diabetes educator', 'Consider continuous glucose monitor'],
        aiReasoning: 'Risk score moderate due to improved glucose control but persistent elevation. AI detects 23% improvement over 3 months.'
      }
    },
    {
      id: 3,
      name: 'Maria Garcia',
      age: 54,
      condition: 'Chronic Pain',
      riskScore: 65,
      lastVisit: '2024-11-18',
      aiSummary: 'Chronic lower back pain with good response to physical therapy. Pain scores declining consistently.',
      keyTerms: ['Chronic pain', 'Physical therapy', 'NSAIDs', 'MRI normal'],
      latestVitals: { painScore: '4/10', bp: '118/76', hr: '68', temp: '98.4' },
      insights: {
        riskFactors: ['Chronic pain affecting daily activities', 'Long-term NSAID use concerns', 'Mild depression symptoms'],
        recommendations: ['Continue PT 3x weekly', 'Gradual NSAID reduction', 'Consider pain psychology referral'],
        aiReasoning: 'Risk score declining due to improved pain management and functional capacity. Patient compliance excellent.'
      }
    },
    {
      id: 4,
      name: 'Robert Chen',
      age: 72,
      condition: 'COPD',
      riskScore: 84,
      lastVisit: '2024-11-17',
      aiSummary: 'COPD exacerbation risk elevated. Recent spirometry shows decline in lung function.',
      keyTerms: ['COPD', 'Bronchodilators', 'Spirometry', 'Oxygen therapy'],
      latestVitals: { o2sat: '91%', bp: '142/88', hr: '92', temp: '99.1' },
      insights: {
        riskFactors: ['FEV1 decline of 8% since last year', 'Recent respiratory infections', 'Smoking cessation 2 years ago'],
        recommendations: ['Increase bronchodilator frequency', 'Pulmonary rehabilitation referral', 'Annual flu/pneumonia vaccines'],
        aiReasoning: 'High risk due to progressive lung function decline and recent infection history. AI predicts 15% exacerbation risk next 30 days.'
      }
    }
  ])

  const filteredPatients = assignedPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRiskColor = (score) => {
    if (score >= 80) return 'danger'
    if (score >= 60) return 'warning'
    return 'success'
  }

  const getRiskLevel = (score) => {
    if (score >= 80) return 'High Risk'
    if (score >= 60) return 'Medium Risk'
    return 'Low Risk'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
            <p className="text-gray-600 mt-1">AI-powered patient analysis and recommendations</p>
          </div>
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
            <Badge variant="primary" className="inline-flex items-center">
              <BoltIcon className="h-4 w-4 mr-1" />
              AI Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient List */}
        <div className="space-y-4">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Assigned Patients ({filteredPatients.length})
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="space-y-1">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 border-l-4 cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-600">Age {patient.age} • {patient.condition}</p>
                        <p className="text-xs text-gray-500 mt-1">Last visit: {patient.lastVisit}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getRiskColor(patient.riskScore)}>
                          Risk: {patient.riskScore}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{getRiskLevel(patient.riskScore)}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 line-clamp-2">{patient.aiSummary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* AI Insights Details */}
        <div className="space-y-4">
          {selectedPatient ? (
            <>
              {/* Patient Overview */}
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <BoltIcon className="h-5 w-5 mr-2" />
                    AI Analysis - {selectedPatient.name}
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">AI Generated Summary</h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-md">
                        {selectedPatient.aiSummary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Risk Score Explanation</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                          <div
                            className={`h-4 rounded-full ${
                              selectedPatient.riskScore >= 80 ? 'bg-red-500' :
                              selectedPatient.riskScore >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${selectedPatient.riskScore}%` }}
                          ></div>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                            {selectedPatient.riskScore}%
                          </span>
                        </div>
                        <Badge variant={getRiskColor(selectedPatient.riskScore)}>
                          {getRiskLevel(selectedPatient.riskScore)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {selectedPatient.insights.aiReasoning}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Medical Terms Extracted</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.keyTerms.map((term, index) => (
                          <Badge key={index} variant="secondary">
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Latest Vitals */}
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <HeartIcon className="h-5 w-5 mr-2" />
                    Latest Vitals & Metrics
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedPatient.latestVitals).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {key === 'bp' ? 'Blood Pressure' :
                           key === 'hr' ? 'Heart Rate' :
                           key === 'temp' ? 'Temperature' :
                           key === 'glucose' ? 'Glucose' :
                           key === 'o2sat' ? 'O2 Saturation' :
                           key === 'painScore' ? 'Pain Score' : key}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>

              {/* Risk Factors & Recommendations */}
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                    AI Risk Analysis & Recommendations
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1 text-red-500" />
                        Risk Factors Identified
                      </h4>
                      <ul className="space-y-1">
                        {selectedPatient.insights.riskFactors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 shrink-0"></span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-1 text-blue-500" />
                        AI Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {selectedPatient.insights.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button className="flex-1">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
                <Button variant="secondary" className="flex-1">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Risk Assessment
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <Card.Content className="text-center py-12">
                <BoltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                <p className="text-gray-600">Choose a patient from the list to view AI insights and analysis</p>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIInsights