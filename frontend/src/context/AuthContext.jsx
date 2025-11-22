import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password, expectedRole = null) => {
    try {
      const response = await authService.login({ email, password })
      const { user: userData, token } = response
      
      // Validate role if specified
      if (expectedRole && userData.role !== expectedRole) {
        throw new Error(`Access denied. ${expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1)} privileges required.`)
      }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      throw new Error('Login failed: ' + error.message)
    }
  }

  const signup = async (userData) => {
    try {
      const response = await authService.register(userData)
      const { user: newUser, token } = response
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      
      return { success: true, user: newUser, message: 'Account created successfully!' }
    } catch (error) {
      throw new Error('Registration failed: ' + error.message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // Role-specific login methods
  const loginAsAdmin = (email, password) => login(email, password, 'admin')
  const loginAsDoctor = (email, password) => login(email, password, 'doctor')
  const loginAsNurse = (email, password) => login(email, password, 'nurse')

  const value = {
    user,
    login,
    signup,
    logout,
    loginAsAdmin,
    loginAsDoctor,
    loginAsNurse,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}