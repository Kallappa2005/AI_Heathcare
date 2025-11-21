import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const roleRedirects = {
      admin: '/admin',
      doctor: '/doctor',
      nurse: '/nurse'
    }
    
    return <Navigate to={roleRedirects[user.role] || '/login'} replace />
  }

  return children
}

export default ProtectedRoute