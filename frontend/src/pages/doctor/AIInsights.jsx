import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  UserIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  DocumentTextIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import patientService from '../../services/patientService'

const parseArrayField = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch (error) {
      return value.split(',').map((item) => item.trim()).filter(Boolean)
    }
  }
  return []
}

const formatTimestamp = (value) => {
  if (!value) return 'Not available'
  try {
    return new Date(value).toLocaleString()
  } catch (error) {
    return value
  }
}

const calculateAge = (dob) => {
  if (!dob) return null
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }
  return age
}

const buildPatientRecordList = (patients = []) => {
  return patients.map((patient) => {
    const fullName = patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
    return {
      patient: {
        id: patient.id || patient.patientId || patient.medicalRecordNumber,
        fullName: fullName || 'Unnamed Patient',
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        medicalRecordNumber: patient.medicalRecordNumber || patient.patientId,
        email: patient.email,
        phone: patient.phone
      },
      insight: null
    }
  })
}

const AIInsights = () => {
  const [patientRecords, setPatientRecords] = useState([])
  const [patientsLoading, setPatientsLoading] = useState(true)
  const [patientsError, setPatientsError] = useState(null)
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInsights, setSelectedInsights] = useState([])
  const [insightLoading, setInsightLoading] = useState(false)
  const [insightError, setInsightError] = useState(null)
  const [refreshingInsight, setRefreshingInsight] = useState(false)
  const [showCreateNoteSidebar, setShowCreateNoteSidebar] = useState(false)
  const [showRiskAssessmentSidebar, setShowRiskAssessmentSidebar] = useState(false)

  const insightsCacheRef = useRef({})
  const selectedPatientIdRef = useRef(null)

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

  const applyRecordList = useCallback((records, preserveSelection = true) => {
    setPatientRecords(records)

    if (!records.length) {
      setSelectedPatientId(null)
      setSelectedInsights([])
      return
    }

    const activePatientId = preserveSelection ? selectedPatientIdRef.current : null
    const hasActiveRecord = activePatientId && records.some((record) => record.patient?.id === activePatientId)

    if (!preserveSelection || !hasActiveRecord) {
      const firstRecord = records.find((record) => record.patient?.id)
      const fallbackId = firstRecord?.patient?.id || null
      setSelectedPatientId(fallbackId)

      if (fallbackId) {
        if (firstRecord?.insight) {
          insightsCacheRef.current = {
            ...insightsCacheRef.current,
            [fallbackId]: [firstRecord.insight]
          }
          setSelectedInsights([firstRecord.insight])
        } else {
          setSelectedInsights(insightsCacheRef.current[fallbackId] || [])
        }
      }
    }
  }, [])

  const loadPatientsFallback = useCallback(async () => {
    try {
      const response = await patientService.getPatients()
      const patients = response?.patients || response?.data?.patients || []
      return buildPatientRecordList(patients)
    } catch (error) {
      setPatientsError((prev) => prev || error.message || 'Failed to load patients list')
      return []
    }
  }, [])

  const loadPatientsSummary = useCallback(async (preserveSelection = true) => {
    setPatientsLoading(true)
    setPatientsError(null)
    try {
      const response = await patientService.getPatientInsightSummary()
      let records = response?.records || []

      if (!records.length) {
        records = await loadPatientsFallback()
      }

      applyRecordList(records, preserveSelection)
    } catch (error) {
      setPatientsError(error.message || 'Failed to load AI insights summary')
      const fallbackRecords = await loadPatientsFallback()
      applyRecordList(fallbackRecords, preserveSelection)
    } finally {
      setPatientsLoading(false)
    }
  }, [applyRecordList, loadPatientsFallback])

  const loadPatientInsights = useCallback(async (patientId, { forceRefresh = false } = {}) => {
    if (!patientId) return
    if (!forceRefresh && insightsCacheRef.current[patientId]) {
      setSelectedInsights(insightsCacheRef.current[patientId])
      return
    }

    setInsightLoading(true)
    setInsightError(null)
    try {
      const insights = await patientService.getPatientInsights(patientId)
      setSelectedInsights(insights)
      insightsCacheRef.current = {
        ...insightsCacheRef.current,
        [patientId]: insights
      }
    } catch (error) {
      setInsightError(error.message || 'Failed to load AI insights')
      setSelectedInsights([])
    } finally {
      setInsightLoading(false)
    }
  }, [])

  useEffect(() => {
    selectedPatientIdRef.current = selectedPatientId
  }, [selectedPatientId])

  useEffect(() => {
    loadPatientsSummary()
  }, [loadPatientsSummary])

  useEffect(() => {
    if (!selectedPatientId) return
    loadPatientInsights(selectedPatientId)
  }, [selectedPatientId, loadPatientInsights])

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patientRecords
    const query = searchQuery.toLowerCase()
    return patientRecords.filter((record) => {
      const name = record.patient?.fullName?.toLowerCase() || ''
      const mrn = record.patient?.medicalRecordNumber?.toLowerCase() || ''
      const summary = record.insight?.ai_summary?.toLowerCase() || ''
      return name.includes(query) || mrn.includes(query) || summary.includes(query)
    })
  }, [patientRecords, searchQuery])

  const selectedRecord = patientRecords.find((record) => record.patient?.id === selectedPatientId)
  const selectedPatientInfo = selectedRecord?.patient
  const currentInsight = selectedInsights[0] || selectedRecord?.insight || null
  const riskFactors = parseArrayField(currentInsight?.risk_factors || currentInsight?.riskFactors)
  const recommendations = parseArrayField(currentInsight?.recommendations)
  const keyTerms = parseArrayField(currentInsight?.key_terms || currentInsight?.keyTerms)
  const latestVitals = currentInsight?.latestVitals || null

  const handlePatientSelect = (record) => {
    setSelectedPatientId(record.patient?.id || null)
    setShowCreateNoteSidebar(false)
    setShowRiskAssessmentSidebar(false)
  }

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
    if (!selectedPatientInfo) return
    console.log('Creating note:', { patient: selectedPatientInfo.fullName, ...noteForm })
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
    if (!selectedPatientInfo) return
    console.log('Creating risk assessment:', { patient: selectedPatientInfo.fullName, ...riskForm })
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

  const handleRefreshInsights = async () => {
    if (!selectedPatientId) return
    setRefreshingInsight(true)
    setInsightError(null)
    try {
      await patientService.refreshPatientInsight(selectedPatientId)
      const cacheCopy = { ...insightsCacheRef.current }
      delete cacheCopy[selectedPatientId]
      insightsCacheRef.current = cacheCopy
      await loadPatientInsights(selectedPatientId, { forceRefresh: true })
      await loadPatientsSummary()
    } catch (error) {
      setInsightError(error.message || 'Failed to refresh AI insight')
    } finally {
      setRefreshingInsight(false)
    }
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
                Your Patients ({patientRecords.length})
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
                {patientsLoading && (
                  <div className="p-4 text-sm text-gray-500">Loading patients...</div>
                )}
                {patientsError && (
                  <div className="p-4 text-sm text-red-600">{patientsError}</div>
                )}
                {!patientsLoading && !filteredPatients.length && (
                  <div className="p-4 text-sm text-gray-500">No patients match your search.</div>
                )}
                {filteredPatients.map((record) => {
                  const patient = record.patient
                  const insight = record.insight
                  const age = calculateAge(patient?.dateOfBirth)
                  return (
                    <div
                      key={patient?.id || record.insight?.id}
                      onClick={() => handlePatientSelect(record)}
                      className={`p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                        selectedPatientId === patient?.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{patient?.fullName || 'Unnamed Patient'}</h3>
                          <p className="text-sm text-gray-600">MRN: {patient?.medicalRecordNumber || 'N/A'}</p>
                          {insight?.created_at && (
                            <p className="text-xs text-gray-500">Updated {formatTimestamp(insight.created_at)}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant={getRiskColor(insight?.risk_score || 0)}>
                            Risk: {insight?.risk_score ?? 'NA'}
                          </Badge>
                          {age && (
                            <div className="text-xs text-gray-500 mt-1">Age {age}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* AI Analysis Panel */}
        <div className={`transition-all duration-300 ${(showCreateNoteSidebar || showRiskAssessmentSidebar) ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
          {selectedPatientInfo ? (
            <>
              <Card className="mb-6">
                <Card.Header>
                  <Card.Title className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BoltIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      AI Analysis - {selectedPatientInfo.fullName || 'Patient'}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getRiskColor(currentInsight?.risk_score || 0)}>
                        Risk Score: {currentInsight?.risk_score ?? 'NA'}
                      </Badge>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={refreshingInsight}
                        onClick={handleRefreshInsights}
                        className="flex items-center"
                      >
                        <ArrowPathIcon className={`h-4 w-4 mr-1 ${refreshingInsight ? 'animate-spin' : ''}`} />
                        {refreshingInsight ? 'Refreshing' : 'Refresh'}
                      </Button>
                    </div>
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {insightLoading && (
                      <div className="text-sm text-gray-500">Loading clinical insight...</div>
                    )}
                    {insightError && (
                      <div className="text-sm text-red-600">{insightError}</div>
                    )}
                    {currentInsight && (
                      <>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">AI Summary</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">{currentInsight.ai_summary || 'No summary available.'}</p>
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <p>Model version: {currentInsight.model_version || 'ocr-v1'}</p>
                            <p>Confidence: {(currentInsight.confidence_score ?? 0).toFixed(2)}</p>
                            <p>Generated: {formatTimestamp(currentInsight.created_at)}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Medical Terms Extracted</h4>
                          <div className="flex flex-wrap gap-2">
                            {keyTerms.length ? (
                              keyTerms.map((term, index) => (
                                <Badge key={index} variant="secondary">
                                  {term}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No highlighted terms</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <HeartIcon className="h-4 w-4 mr-1 text-red-500" />
                            Latest Vitals & Metrics
                          </h4>
                          {latestVitals ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {Object.entries(latestVitals).map(([key, value]) => (
                                <div key={key} className="text-center">
                                  <div className="text-lg font-semibold text-gray-900">{String(value)}</div>
                                  <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No vitals were attached to this insight.</p>
                          )}
                        </div>
                      </>
                    )}
                    {!currentInsight && !insightLoading && (
                      <p className="text-sm text-gray-500">No AI insight has been generated for this patient yet.</p>
                    )}
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
                  {currentInsight ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1 text-red-500" />
                          Risk Factors Identified
                        </h4>
                        <ul className="space-y-1">
                          {riskFactors.length ? (
                            riskFactors.map((factor, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start">
                                <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 shrink-0"></span>
                                {factor}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-gray-500">No elevated risk factors recorded.</li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-1 text-blue-500" />
                          AI Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {recommendations.length ? (
                            recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start">
                                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 shrink-0"></span>
                                {rec}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-gray-500">No specific recommendations were produced.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Select a patient to view AI-driven risk factors and recommendations.</p>
                  )}
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
                      value={selectedPatientInfo?.fullName || ''}
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
                      value={selectedPatientInfo?.fullName || ''}
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