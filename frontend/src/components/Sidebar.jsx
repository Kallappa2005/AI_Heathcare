import { Fragment } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  CogIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

// Move SidebarContent outside of the main component
const SidebarContent = ({ navigation, location, setSidebarOpen, user }) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="flex items-center h-16 px-4 bg-blue-600">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-bold text-sm">H</span>
        </div>
        <span className="ml-3 text-white font-semibold text-lg">
          Healthcare AI
        </span>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 py-4 space-y-1 bg-white">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <Link
            key={item.name}
            to={item.href}
            className={clsx(
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon
              className={clsx(
                'mr-3 h-5 w-5 shrink-0',
                isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              )}
            />
            {item.name}
          </Link>
        )
      })}
    </nav>

    {/* User info */}
    <div className="shrink-0 p-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium text-sm">
            {user?.name?.charAt(0)}
          </span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  </div>
)

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth()
  const location = useLocation()

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Search Patients', href: '/patients', icon: MagnifyingGlassIcon }
    ]

    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: HomeIcon },
          { name: 'Patient Registration', href: '/admin/patients', icon: UserGroupIcon },
          { name: 'Staff Management', href: '/admin/staff', icon: UserGroupIcon },
          { name: 'System Analytics', href: '/admin/analytics', icon: ChartBarIcon },
          { name: 'Settings', href: '/admin/settings', icon: CogIcon },
          ...baseItems
        ]
      case 'doctor':
        return [
          { name: 'Dashboard', href: '/doctor', icon: HomeIcon },
          { name: 'AI Insights', href: '/doctor/insights', icon: ChartBarIcon },
          { name: 'Patient Notes', href: '/doctor/notes', icon: DocumentTextIcon },
          { name: 'Risk Assessments', href: '/doctor/risk', icon: HeartIcon },
          ...baseItems
        ]
      case 'nurse':
        return [
          { name: 'Dashboard', href: '/nurse', icon: HomeIcon },
          { name: 'Vitals Upload', href: '/nurse/vitals', icon: ClipboardDocumentListIcon },
          { name: 'Lab Reports', href: '/nurse/labs', icon: DocumentTextIcon },
          { name: 'Medication Log', href: '/nurse/medications', icon: HeartIcon },
          ...baseItems
        ]
      default:
        return baseItems
    }
  }

  const navigation = getNavigationItems()

  return (
    <>
      {/* Mobile sidebar */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </TransitionChild>

          <div className="fixed inset-0 z-40 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative flex flex-col flex-1 w-64 max-w-xs bg-white">
                <TransitionChild
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </TransitionChild>
                <SidebarContent 
                  navigation={navigation} 
                  location={location} 
                  setSidebarOpen={setSidebarOpen} 
                  user={user} 
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent 
            navigation={navigation} 
            location={location} 
            setSidebarOpen={setSidebarOpen} 
            user={user} 
          />
        </div>
      </div>
    </>
  )
}

export default Sidebar