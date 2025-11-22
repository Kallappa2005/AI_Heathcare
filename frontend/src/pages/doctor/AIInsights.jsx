import { useState } from 'react'
import { 
  UserIcon, 
  BoltIcon, 
  ExclamationTriangleIcon, 
  HeartIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const AIInsights = () => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateNoteSidebar, setShowCreateNoteSidebar] = useState(false)
  const [showRiskAssessmentSidebar, setShowRiskAssessmentSidebar] = useState(false)
  
  // Form states
  const [noteForm, setNoteForm] = useState({
    title: '',
    type: 'progress',
    content: '',
    priority: 'normal',
    tags: [],
    followUpDate: ''
  })
  
  const [riskForm, setRiskForm] = useState({
    assessmentType: 'comprehensive',
    riskFactors: [],
    currentMedications: '',
    symptoms: '',
    vitalsConcerns: '',
    labResults: '',
    recommendations: '',
    followUpPlan: '',
    urgencyLevel: 'routine'
  })

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
      keyTerms: ['Chronic pain', 'Physical therapy', 'Opioid reduction', 'Functional improvement'],
      latestVitals: { pain: '4/10', bp: '132/78', hr: '74', temp: '98.4' },
      insights: {
        riskFactors: ['Long-term opioid use', 'Mobility limitations', 'Risk of medication dependency'],
        recommendations: ['Continue physical therapy', 'Gradual opioid tapering', 'Consider alternative pain management'],
        aiReasoning: 'Risk score moderate with positive trend. AI analysis shows 40% pain reduction over 6 weeks with increased activity levels.'
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
      keyTerms: ['COPD', 'Spirometry', 'Bronchodilators', 'Oxygen therapy'],
      latestVitals: { spO2: '91%', rr: '22', bp: '145/88', temp: '98.1' },
      insights: {
        riskFactors: ['Declining FEV1', 'Recent infection history', 'Medication adherence concerns'],
        recommendations: ['Optimize bronchodilator therapy', 'Pulmonary rehabilitation referral', 'Home oxygen assessment'],
        aiReasoning: 'Risk score high due to functional decline and exacerbation history. AI predicts 35% risk of hospitalization in next 30 days.'
      }
    }
  ])

  const filteredPatients = assignedPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateNote = () => {
    setShowCreateNoteSidebar(true)
    setShowRiskAssessmentSidebar(false)
  }

  const handleRiskAssessment = () => {
    setShowRiskAssessmentSidebar(true)
    setShowCreateNoteSidebar(false)
  }

  const closeSidebars = () => {
    setShowCreateNoteSidebar(false)
    setShowRiskAssessmentSidebar(false)
  }

  const handleNoteSubmit = (e) => {
    e.preventDefault()
    console.log('Creating note:', { patient: selectedPatient.name, ...noteForm })
    alert('Note created successfully!')
    setNoteForm({
      title: '',
      type: 'progress',
      content: '',
      priority: 'normal',
      tags: [],
      followUpDate: ''
    })
    closeSidebars()
  }

  const handleRiskSubmit = (e) => {
    e.preventDefault()
    console.log('Creating risk assessment:', { patient: selectedPatient.name, ...riskForm })
    alert('Risk assessment created successfully!')
    setRiskForm({
      assessmentType: 'comprehensive',
      riskFactors: [],
      currentMedications: '',
      symptoms: '',
      vitalsConcerns: '',
      labResults: '',
      recommendations: '',
      followUpPlan: '',
      urgencyLevel: 'routine'
    })
    closeSidebars()
  }

  const getRiskColor = (score) => {
    if (score >= 80) return 'danger'
    if (score >= 60) return 'warning'
    return 'success'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-1">AI-powered patient analysis and recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Your Patients ({assignedPatients.length})
              </Card.Title>
              <div className="mt-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="space-y-1">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                      selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-600">{patient.condition}</p>
                        <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getRiskColor(patient.riskScore)}>
                          Risk: {patient.riskScore}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">Age {patient.age}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* AI Analysis Panel */}
        <div className={`transition-all duration-300 ${(showCreateNoteSidebar || showRiskAssessmentSidebar) ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
          {selectedPatient ? (
            <>
              <Card className="mb-6">
                <Card.Header>
                  <Card.Title className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BoltIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      AI Analysis - {selectedPatient.name}
                    </div>
                    <Badge variant={getRiskColor(selectedPatient.riskScore)}>
                      Risk Score: {selectedPatient.riskScore}
                    </Badge>
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {/* AI Summary */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">AI Summary</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{selectedPatient.aiSummary}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        {selectedPatient.insights.aiReasoning}
                      </div>
                    </div>

                    {/* Key Medical Terms */}
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

                    {/* Latest Vitals */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1 text-red-500" />
                        Latest Vitals & Metrics
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(selectedPatient.latestVitals).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{value}</div>
                            <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card className="mb-6">
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-orange-500" />
                    AI Risk Analysis & Recommendations
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Button 
                  className="flex-1"
                  onClick={handleCreateNote}
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={handleRiskAssessment}
                >
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

        {/* Create Note Sidebar */}
        {showCreateNoteSidebar && (
          <div className="lg:col-span-1">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Create Note
                  </Card.Title>
                  <button 
                    onClick={closeSidebars}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleNoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient
                    </label>
                    <input
                      type="text"
                      value={selectedPatient?.name || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note Title
                    </label>
                    <input
                      type="text"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                      placeholder="Enter note title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                      placeholder="Enter note content..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Save Note
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={closeSidebars}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Risk Assessment Sidebar */}
        {showRiskAssessmentSidebar && (
          <div className="lg:col-span-1">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Risk Assessment
                  </Card.Title>
                  <button 
                    onClick={closeSidebars}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleRiskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient
                    </label>
                    <input
                      type="text"
                      value={selectedPatient?.name || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assessment Type
                    </label>
                    <select
                      value={riskForm.assessmentType}
                      onChange={(e) => setRiskForm({...riskForm, assessmentType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="comprehensive">Comprehensive Risk Assessment</option>
                      <option value="cardiac">Cardiac Risk Assessment</option>
                      <option value="surgical">Surgical Risk Assessment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Factors
                    </label>
                    <textarea
                      value={riskForm.riskFactors.join(', ')}
                      onChange={(e) => setRiskForm({...riskForm, riskFactors: e.target.value.split(', ').filter(f => f.trim())})}
                      placeholder="Enter risk factors separated by commas..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recommendations
                    </label>
                    <textarea
                      value={riskForm.recommendations}
                      onChange={(e) => setRiskForm({...riskForm, recommendations: e.target.value})}
                      placeholder="Enter clinical recommendations..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Save Assessment
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={closeSidebars}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIInsights