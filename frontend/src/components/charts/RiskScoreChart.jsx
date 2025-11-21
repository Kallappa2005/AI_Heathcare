import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const RiskScoreChart = ({ score, size = 120 }) => {
  const getRiskColor = (score) => {
    if (score >= 80) return ['#EF4444', '#FCA5A5'] // red
    if (score >= 60) return ['#F59E0B', '#FCD34D'] // yellow
    return ['#10B981', '#6EE7B7'] // green
  }

  const [primaryColor] = getRiskColor(score)
  
  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [primaryColor, '#F3F4F6'],
        borderColor: [primaryColor, '#F3F4F6'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{score}</div>
          <div className="text-xs text-gray-500">Risk Score</div>
        </div>
      </div>
    </div>
  )
}

export default RiskScoreChart