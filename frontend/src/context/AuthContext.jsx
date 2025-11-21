import { createContext, useContext, useState, useEffect } from 'react'

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

  const login = async (email, password) => {
    try {
      // Mock authentication based on email patterns
      let mockUser = null
      
      if (email.includes('admin')) {
        mockUser = {
          id: 1,
          name: 'Dr. Admin',
          email: email,
          role: 'admin'
        }
      } else if (email.includes('doctor')) {
        mockUser = {
          id: 2,
          name: 'Dr. Smith',
          email: email,
          role: 'doctor'
        }
      } else if (email.includes('nurse')) {
        mockUser = {
          id: 3,
          name: 'Nurse Johnson',
          email: email,
          role: 'nurse'
        }
      } else {
        throw new Error('Invalid credentials')
      }

      const mockToken = 'mock-jwt-token-' + Date.now()
      
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      
      return { success: true, user: mockUser }
    } catch (error) {
      throw new Error('Login failed: ' + error.message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}