import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, CogIcon } from '@heroicons/react/24/outline'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { loginAsAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/admin'

  // Handle success message from signup
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      if (location.state?.email) {
        setEmail(location.state.email)
      }
      // Clear the state to prevent message from persisting
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginAsAdmin(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const demoCredentials = [
    { role: 'Admin', email: 'admin@hospital.com', password: 'admin123' }
  ]

  const fillDemo = (email, password) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-red-600 rounded-full flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="ml-3 text-3xl font-bold text-gray-900">
                Administrator Login
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Access administrative dashboard and system settings
            </p>
            <div className="mt-2 flex space-x-4 text-sm">
              <Link to="/doctor/login" className="text-blue-600 hover:text-blue-500">Doctor Login</Link>
              <Link to="/nurse/login" className="text-green-600 hover:text-green-500">Nurse Login</Link>
            </div>
          </div>

          <div className="mt-8">
            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Administrator Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="admin@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm pr-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  {loading ? 'Signing in...' : 'Sign in as Admin'}
                </button>
              </div>
            </form>

            {/* Demo credentials */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Account</span>
                </div>
              </div>

              <div className="mt-4">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.role}
                    type="button"
                    onClick={() => fillDemo(cred.email, cred.password)}
                    className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <span className="font-medium text-gray-900">{cred.role}</span>
                    <span className="text-gray-500 ml-2">{cred.email}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Don't have an admin account?{' '}
                  <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">
                    Request Access
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Admin info */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-red-600 to-red-800">
          <div className="h-full flex items-center justify-center p-12">
            <div className="text-center text-white">
              <CogIcon className="h-24 w-24 mx-auto mb-6 text-red-200" />
              <h3 className="text-3xl font-bold mb-4">Administrator Portal</h3>
              <p className="text-xl mb-6 text-red-100">
                Manage healthcare system operations and settings
              </p>
              <div className="space-y-4 text-left max-w-md">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 mr-3 text-red-200" />
                  <span>System administration</span>
                </div>
                <div className="flex items-center">
                  <CogIcon className="h-6 w-6 mr-3 text-red-200" />
                  <span>User management</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 mr-3 text-red-200" />
                  <span>Security & compliance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin