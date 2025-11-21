import { useState } from 'react'
import { CogIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const Settings = () => {
  const [settings, setSettings] = useState({
    hospital: {
      name: 'City General Hospital',
      address: '123 Healthcare Drive, Medical City, HC 12345',
      phone: '(555) 123-HELP',
      email: 'info@citygeneralhospital.com',
      website: 'www.citygeneralhospital.com'
    },
    operatingHours: {
      monday: { open: '06:00', close: '22:00', isOpen: true },
      tuesday: { open: '06:00', close: '22:00', isOpen: true },
      wednesday: { open: '06:00', close: '22:00', isOpen: true },
      thursday: { open: '06:00', close: '22:00', isOpen: true },
      friday: { open: '06:00', close: '22:00', isOpen: true },
      saturday: { open: '08:00', close: '18:00', isOpen: true },
      sunday: { open: '08:00', close: '18:00', isOpen: true }
    },
    emergency: {
      alwaysOpen: true,
      phone: '(555) 911-HELP'
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: true,
      systemMaintenance: true,
      lowInventory: true,
      criticalPatients: true
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 3,
      twoFactorAuth: false
    },
    backup: {
      autoBackup: true,
      backupTime: '02:00',
      retentionDays: 30
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('hospital')

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleTimeChange = (day, timeType, value) => {
    setSettings(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [timeType]: value
        }
      }
    }))
  }

  const handleDayToggle = (day) => {
    setSettings(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          isOpen: !prev.operatingHours[day].isOpen
        }
      }
    }))
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // TODO: Implement actual save functionality
    alert('Settings saved successfully!')
    setIsEditing(false)
  }

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  }

  const tabs = [
    { id: 'hospital', name: 'Hospital Info', icon: CogIcon },
    { id: 'hours', name: 'Operating Hours', icon: ClockIcon },
    { id: 'notifications', name: 'Notifications', icon: CogIcon },
    { id: 'security', name: 'Security', icon: CogIcon },
    { id: 'backup', name: 'Backup', icon: CogIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">Configure hospital operations and system preferences</p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="inline-flex items-center">
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Settings
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Hospital Information Tab */}
          {activeTab === 'hospital' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Hospital Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                  <input
                    type="text"
                    value={settings.hospital.name}
                    onChange={(e) => handleInputChange('hospital', 'name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.hospital.phone}
                    onChange={(e) => handleInputChange('hospital', 'phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={settings.hospital.address}
                    onChange={(e) => handleInputChange('hospital', 'address', e.target.value)}
                    disabled={!isEditing}
                    rows="2"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.hospital.email}
                    onChange={(e) => handleInputChange('hospital', 'email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={settings.hospital.website}
                    onChange={(e) => handleInputChange('hospital', 'website', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Operating Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Operating Hours</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emergency-always-open"
                      checked={settings.emergency.alwaysOpen}
                      onChange={(e) => handleInputChange('emergency', 'alwaysOpen', e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emergency-always-open" className="ml-2 text-sm text-gray-700">
                      Emergency Services 24/7
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {Object.entries(settings.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-20">
                      <input
                        type="checkbox"
                        id={`${day}-open`}
                        checked={hours.isOpen}
                        onChange={() => handleDayToggle(day)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <label htmlFor={`${day}-open`} className="text-sm font-medium text-gray-900">
                        {dayNames[day]}
                      </label>
                    </div>
                    
                    {hours.isOpen ? (
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Open:</label>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                            disabled={!isEditing}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Close:</label>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                            disabled={!isEditing}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 flex-1">Closed</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Emergency Contact</h4>
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-yellow-700">Emergency Phone:</label>
                  <input
                    type="tel"
                    value={settings.emergency.phone}
                    onChange={(e) => handleInputChange('emergency', 'phone', e.target.value)}
                    disabled={!isEditing}
                    className="border border-yellow-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-yellow-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <p className="text-sm text-gray-600">
                        {key === 'emailAlerts' && 'Receive email notifications for important events'}
                        {key === 'smsAlerts' && 'Receive SMS notifications for critical alerts'}
                        {key === 'systemMaintenance' && 'Get notified about system maintenance'}
                        {key === 'lowInventory' && 'Alert when inventory levels are low'}
                        {key === 'criticalPatients' && 'Immediate alerts for critical patient status'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="w-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                  <input
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="w-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="w-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="two-factor"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="two-factor" className="ml-2 text-sm text-gray-700">
                    Enable Two-Factor Authentication
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Backup Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-backup"
                    checked={settings.backup.autoBackup}
                    onChange={(e) => handleInputChange('backup', 'autoBackup', e.target.checked)}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-backup" className="ml-2 text-sm text-gray-700">
                    Enable Automatic Backups
                  </label>
                </div>
                {settings.backup.autoBackup && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Backup Time</label>
                      <input
                        type="time"
                        value={settings.backup.backupTime}
                        onChange={(e) => handleInputChange('backup', 'backupTime', e.target.value)}
                        disabled={!isEditing}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                      <input
                        type="number"
                        value={settings.backup.retentionDays}
                        onChange={(e) => handleInputChange('backup', 'retentionDays', parseInt(e.target.value))}
                        disabled={!isEditing}
                        className="w-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings