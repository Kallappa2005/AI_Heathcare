import { Link } from 'react-router-dom'
import { ShieldCheckIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline'

const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login selection */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <h2 className="ml-3 text-3xl font-bold text-gray-900">
                Healthcare AI Platform
              </h2>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Choose your role to access the appropriate dashboard
            </p>
            
            <div className="mt-8 space-y-4">
              <Link
                to="/admin/login"
                className="w-full flex items-center px-6 py-4 border border-red-300 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors shadow-sm"
              >
                <ShieldCheckIcon className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Administrator Login</div>
                  <div className="text-sm text-red-600">System management & settings</div>
                </div>
              </Link>
              
              <Link
                to="/doctor/login"
                className="w-full flex items-center px-6 py-4 border border-blue-300 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm"
              >
                <UserIcon className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Doctor Login</div>
                  <div className="text-sm text-blue-600">AI insights & patient care</div>
                </div>
              </Link>
              
              <Link
                to="/nurse/login"
                className="w-full flex items-center px-6 py-4 border border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors shadow-sm"
              >
                <HeartIcon className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Nurse Login</div>
                  <div className="text-sm text-green-600">Clinical documentation & care</div>
                </div>
              </Link>
            </div>
            
            <div className="mt-8 text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up here
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Healthcare image/info */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="h-full flex items-center justify-center p-12">
            <div className="text-center text-white">
              <div className="flex justify-center space-x-4 mb-6">
                <ShieldCheckIcon className="h-12 w-12 text-red-200" />
                <UserIcon className="h-12 w-12 text-blue-200" />
                <HeartIcon className="h-12 w-12 text-green-200" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Healthcare AI Platform</h3>
              <p className="text-xl mb-8 text-blue-100">
                Secure, role-based access to advanced healthcare tools
              </p>
              <div className="space-y-6 text-left max-w-lg">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 mr-4 text-red-200" />
                  <div>
                    <div className="font-semibold text-red-200">Administrator Portal</div>
                    <div className="text-blue-100">System management and user oversight</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-6 w-6 mr-4 text-blue-200" />
                  <div>
                    <div className="font-semibold text-blue-200">Doctor Dashboard</div>
                    <div className="text-blue-100">AI-powered medical insights and diagnosis</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <HeartIcon className="h-6 w-6 mr-4 text-green-200" />
                  <div>
                    <div className="font-semibold text-green-200">Nurse Interface</div>
                    <div className="text-blue-100">Patient care coordination and monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login