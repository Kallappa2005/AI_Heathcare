import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/auth/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import PatientRegistration from './pages/admin/PatientRegistration'
import StaffManagement from './pages/admin/StaffManagement'
import SystemAnalytics from './pages/admin/SystemAnalytics'
import Settings from './pages/admin/Settings'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import AIInsights from './pages/doctor/AIInsights'
import PatientNotes from './pages/doctor/PatientNotes'
import RiskAssessments from './pages/doctor/RiskAssessments'
import NurseDashboard from './pages/nurse/NurseDashboard'
import PatientProfile from './pages/patient/PatientProfile'
import PatientSearch from './pages/patient/PatientSearch'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Admin Routes */}
              <Route path="admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/patients" element={
                <ProtectedRoute requiredRole="admin">
                  <PatientRegistration />
                </ProtectedRoute>
              } />
              <Route path="admin/staff" element={
                <ProtectedRoute requiredRole="admin">
                  <StaffManagement />
                </ProtectedRoute>
              } />
              <Route path="admin/analytics" element={
                <ProtectedRoute requiredRole="admin">
                  <SystemAnalytics />
                </ProtectedRoute>
              } />
              <Route path="admin/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Doctor Routes */}
              <Route path="doctor" element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="doctor/insights" element={
                <ProtectedRoute requiredRole="doctor">
                  <AIInsights />
                </ProtectedRoute>
              } />
              <Route path="doctor/notes" element={
                <ProtectedRoute requiredRole="doctor">
                  <PatientNotes />
                </ProtectedRoute>
              } />
              <Route path="doctor/risk" element={
                <ProtectedRoute requiredRole="doctor">
                  <RiskAssessments />
                </ProtectedRoute>
              } />
              
              {/* Nurse Routes */}
              <Route path="nurse" element={
                <ProtectedRoute requiredRole="nurse">
                  <NurseDashboard />
                </ProtectedRoute>
              } />
              
              {/* Patient Routes */}
              <Route path="patients" element={<PatientSearch />} />
              <Route path="patients/:id" element={<PatientProfile />} />
            </Route>
            
            {/* Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
