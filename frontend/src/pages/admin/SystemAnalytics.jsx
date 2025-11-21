import { useState } from 'react'
import { ChartBarIcon, UsersIcon, UserPlusIcon, CpuChipIcon } from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const SystemAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7days')
  const [analytics] = useState({
    dailyActiveUsers: {
      today: 245,
      yesterday: 232,
      change: '+5.6%',
      data: [180, 195, 210, 225, 232, 240, 245]
    },
    patientsAdded: {
      total: 1284,
      thisWeek: 67,
      lastWeek: 58,
      change: '+15.5%',
      data: [8, 12, 9, 11, 10, 8, 9]
    },
    aiProcessing: {
      totalProcessed: 45672,
      todayProcessed: 156,
      avgResponseTime: '2.3s',
      accuracy: '94.7%',
      data: [120, 135, 142, 156, 148, 162, 156]
    },
    systemHealth: {
      uptime: '99.8%',
      responseTime: '1.2s',
      errors: 3,
      warnings: 8
    }
  })

  const getLabels = () => {
    const labels = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
    
    return labels
  }

  // Daily Active Users Chart
  const activeUsersChartData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Daily Active Users',
        data: analytics.dailyActiveUsers.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  // Patients Added Chart
  const patientsAddedChartData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Patients Added',
        data: analytics.patientsAdded.data,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  }

  // AI Processing Chart
  const aiProcessingChartData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'AI Tasks Processed',
        data: analytics.aiProcessing.data,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  // System Health Doughnut Chart
  const systemHealthData = {
    labels: ['Healthy', 'Warnings', 'Errors'],
    datasets: [
      {
        data: [89, 8, 3],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
            <p className="text-gray-600 mt-1">Monitor system performance and user activity</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Daily Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.dailyActiveUsers.today}</p>
                <p className="text-sm text-green-600 mt-1">{analytics.dailyActiveUsers.change}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Patients Added</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.patientsAdded.thisWeek}</p>
                <p className="text-sm text-green-600 mt-1">{analytics.patientsAdded.change}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CpuChipIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">AI Tasks Processed</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.aiProcessing.todayProcessed}</p>
                <p className="text-sm text-purple-600 mt-1">{analytics.aiProcessing.accuracy} accuracy</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.systemHealth.uptime}</p>
                <p className="text-sm text-gray-600 mt-1">{analytics.systemHealth.responseTime} avg response</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Daily Active Users
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="h-64">
              <Line data={activeUsersChartData} options={chartOptions} />
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <span>Previous: {analytics.dailyActiveUsers.yesterday}</span>
              <span>Current: {analytics.dailyActiveUsers.today}</span>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Patients Added Daily
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="h-64">
              <Bar data={patientsAddedChartData} options={chartOptions} />
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <span>Total This Week: {analytics.patientsAdded.thisWeek}</span>
              <span>Total: {analytics.patientsAdded.total}</span>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <CpuChipIcon className="h-5 w-5 mr-2" />
              AI Processing Stats
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="h-64">
              <Line data={aiProcessingChartData} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Processed:</span>
                <p className="font-semibold">{analytics.aiProcessing.totalProcessed.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Avg Response Time:</span>
                <p className="font-semibold">{analytics.aiProcessing.avgResponseTime}</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              System Health Overview
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="w-48 h-48">
                <Doughnut data={systemHealthData} options={doughnutOptions} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Errors:</span>
                <p className="font-semibold text-red-600">{analytics.systemHealth.errors}</p>
              </div>
              <div>
                <span className="text-gray-600">Warnings:</span>
                <p className="font-semibold text-yellow-600">{analytics.systemHealth.warnings}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <Card.Header>
          <Card.Title>Detailed Analytics</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Daily Active Users
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {analytics.dailyActiveUsers.today}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {analytics.dailyActiveUsers.yesterday}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {analytics.dailyActiveUsers.change}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ↗ Growing
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    New Patients (Weekly)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {analytics.patientsAdded.thisWeek}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {analytics.patientsAdded.lastWeek}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {analytics.patientsAdded.change}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ↗ Growing
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    AI Processing Accuracy
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {analytics.aiProcessing.accuracy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    93.2%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +1.5%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ↗ Improving
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    System Response Time
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {analytics.systemHealth.responseTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    1.5s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    -0.3s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ↗ Improved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default SystemAnalytics