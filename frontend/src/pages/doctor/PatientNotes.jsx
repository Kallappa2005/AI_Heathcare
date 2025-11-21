import { useState } from 'react'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  ClockIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const PatientNotes = () => {
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterPatient, setFilterPatient] = useState('')
  
  const [noteForm, setNoteForm] = useState({
    patient: '',
    noteType: '',
    subject: '',
    content: '',
    followUpDate: '',
    priority: 'normal'
  })

  const [patients] = useState([
    { id: 1, name: 'John Anderson', age: 67, condition: 'Hypertension' },
    { id: 2, name: 'Sarah Johnson', age: 34, condition: 'Diabetes Type 2' },
    { id: 3, name: 'Maria Garcia', age: 54, condition: 'Chronic Pain' },
    { id: 4, name: 'Robert Chen', age: 72, condition: 'COPD' }
  ])

  const [noteTemplates] = useState([
    {
      id: 'consultation',
      name: 'General Consultation',
      template: `CHIEF COMPLAINT:
[Patient's primary concern]

HISTORY OF PRESENT ILLNESS:
[Detailed description of current symptoms]

PHYSICAL EXAMINATION:
General: [Patient appearance, vitals]
Systems: [Relevant system examination]

ASSESSMENT:
[Clinical impression and diagnosis]

PLAN:
1. [Treatment plan]
2. [Medications]
3. [Follow-up instructions]`
    },
    {
      id: 'followup',
      name: 'Follow-up Visit',
      template: `FOLLOW-UP VISIT:
Previous visit: [Date]
Previous diagnosis: [Diagnosis]

CURRENT STATUS:
[Patient's response to treatment]

REVIEW OF SYSTEMS:
[Any new or ongoing symptoms]

ASSESSMENT:
[Current status and progress]

PLAN:
[Continued treatment or modifications]`
    },
    {
      id: 'discharge',
      name: 'Discharge Summary',
      template: `DISCHARGE SUMMARY:
Admission Date: [Date]
Discharge Date: [Date]

FINAL DIAGNOSIS:
[Primary and secondary diagnoses]

HOSPITAL COURSE:
[Summary of treatment during stay]

DISCHARGE MEDICATIONS:
[List of prescribed medications]

FOLLOW-UP INSTRUCTIONS:
[Appointment dates and instructions]

ACTIVITY RESTRICTIONS:
[Any limitations or restrictions]`
    },
    {
      id: 'treatment',
      name: 'Treatment Plan',
      template: `TREATMENT PLAN:
Patient: [Name]
Diagnosis: [Primary diagnosis]

GOALS:
[Short-term and long-term goals]

MEDICATIONS:
[Current medications and changes]

LIFESTYLE MODIFICATIONS:
[Diet, exercise, other recommendations]

MONITORING:
[Labs, vitals, follow-up requirements]

PATIENT EDUCATION:
[Information provided to patient]`
    }
  ])

  const [notes] = useState([
    {
      id: 1,
      patient: 'John Anderson',
      patientId: 1,
      noteType: 'consultation',
      subject: 'Hypertension Management Review',
      content: 'Patient presents with elevated BP readings at home. Current medications include Lisinopril 10mg daily. Discussed lifestyle modifications and medication adjustment.',
      date: '2024-11-20',
      time: '10:30 AM',
      priority: 'high',
      followUpDate: '2024-12-05'
    },
    {
      id: 2,
      patient: 'Sarah Johnson',
      patientId: 2,
      noteType: 'followup',
      subject: 'Diabetes Control Assessment',
      content: 'HbA1c improved to 7.2% from 8.1%. Patient demonstrates good understanding of glucose monitoring. Continue current metformin dosage.',
      date: '2024-11-19',
      time: '2:15 PM',
      priority: 'normal',
      followUpDate: '2024-12-19'
    },
    {
      id: 3,
      patient: 'Maria Garcia',
      patientId: 3,
      noteType: 'treatment',
      subject: 'Pain Management Update',
      content: 'Patient reports 40% improvement in lower back pain with PT. Pain score decreased from 7/10 to 4/10. Recommended continuing physical therapy.',
      date: '2024-11-18',
      time: '11:00 AM',
      priority: 'normal',
      followUpDate: '2024-12-02'
    },
    {
      id: 4,
      patient: 'John Anderson',
      patientId: 1,
      noteType: 'consultation',
      subject: 'Initial Cardiac Evaluation',
      content: 'New patient with family history of CAD. EKG shows normal sinus rhythm. Ordered lipid panel and stress test. Started on low-dose aspirin.',
      date: '2024-11-15',
      time: '9:45 AM',
      priority: 'normal',
      followUpDate: '2024-11-30'
    }
  ])

  const handleInputChange = (e) => {
    setNoteForm({
      ...noteForm,
      [e.target.name]: e.target.value
    })
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id)
    setNoteForm({
      ...noteForm,
      noteType: template.id,
      content: template.template
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating note:', noteForm)
    alert('Note saved successfully!')
    setShowNoteForm(false)
    setNoteForm({
      patient: '',
      noteType: '',
      subject: '',
      content: '',
      followUpDate: '',
      priority: 'normal'
    })
    setSelectedTemplate('')
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.patient.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = filterDate === '' || note.date === filterDate
    const matchesPatient = filterPatient === '' || note.patient === filterPatient
    return matchesSearch && matchesDate && matchesPatient
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'normal': return 'success'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getNoteTypeLabel = (type) => {
    const template = noteTemplates.find(t => t.id === type)
    return template?.name || type
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Notes</h1>
            <p className="text-gray-600 mt-1">Create and manage patient consultation notes</p>
          </div>
          <Button
            onClick={() => setShowNoteForm(true)}
            className="inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {/* Create Note Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Note</h2>
                <button
                  onClick={() => setShowNoteForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                    <select
                      name="patient"
                      value={noteForm.patient}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.name}>
                          {patient.name} (Age {patient.age})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={noteForm.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief description of the consultation"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={noteForm.priority}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      name="followUpDate"
                      value={noteForm.followUpDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column - Templates */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note Templates</label>
                    <div className="grid grid-cols-2 gap-2">
                      {noteTemplates.map(template => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => handleTemplateSelect(template)}
                          className={`p-3 text-left rounded-md border transition-colors ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-medium text-sm">{template.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Note Content</label>
                <textarea
                  name="content"
                  value={noteForm.content}
                  onChange={handleInputChange}
                  required
                  rows="12"
                  placeholder="Enter detailed consultation notes here..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowNoteForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Note</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <Card.Content className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterPatient}
              onChange={(e) => setFilterPatient(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Patients</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.name}>{patient.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('')
                setFilterDate('')
                setFilterPatient('')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map(note => (
          <Card key={note.id}>
            <Card.Content className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{note.subject}</h3>
                    <Badge variant={getPriorityColor(note.priority)}>
                      {note.priority}
                    </Badge>
                    <Badge variant="secondary">
                      {getNoteTypeLabel(note.noteType)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {note.patient}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {note.date} at {note.time}
                    </div>
                    {note.followUpDate && (
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Follow-up: {note.followUpDate}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{note.content}</p>
                </div>
                
                <div className="ml-6 flex space-x-2">
                  <Button variant="secondary" size="sm">Edit</Button>
                  <Button variant="secondary" size="sm">View</Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card>
          <Card.Content className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notes Found</h3>
            <p className="text-gray-600">
              {searchQuery || filterDate || filterPatient 
                ? 'Try adjusting your filters to see more notes.'
                : 'Start by creating your first patient note.'
              }
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  )
}

export default PatientNotes