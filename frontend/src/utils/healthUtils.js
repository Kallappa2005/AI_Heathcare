// Get risk level based on score
export const getRiskLevel = (score) => {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

// Get risk color classes for UI
export const getRiskColors = (score) => {
  const level = getRiskLevel(score)
  const colors = {
    high: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      ring: 'ring-red-500'
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      ring: 'ring-yellow-500'
    },
    low: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      ring: 'ring-green-500'
    }
  }
  return colors[level]
}

// Get risk text description
export const getRiskText = (score) => {
  const level = getRiskLevel(score)
  const descriptions = {
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk'
  }
  return descriptions[level]
}

// Calculate BMI
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null
  // BMI = weight (kg) / height (m)^2
  const bmi = weight / Math.pow(height / 100, 2)
  return Math.round(bmi * 10) / 10
}

// Get BMI category
export const getBMICategory = (bmi) => {
  if (!bmi) return null
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

// Parse blood pressure reading
export const parseBloodPressure = (reading) => {
  if (!reading || typeof reading !== 'string') return null
  const parts = reading.split('/')
  if (parts.length !== 2) return null
  
  return {
    systolic: parseInt(parts[0]),
    diastolic: parseInt(parts[1])
  }
}

// Categorize blood pressure
export const categorizeBP = (systolic, diastolic) => {
  if (!systolic || !diastolic) return null
  
  if (systolic < 120 && diastolic < 80) return 'Normal'
  if (systolic < 130 && diastolic < 80) return 'Elevated'
  if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) return 'Stage 1 Hypertension'
  if (systolic >= 140 || diastolic >= 90) return 'Stage 2 Hypertension'
  if (systolic >= 180 || diastolic >= 120) return 'Hypertensive Crisis'
  
  return 'Unknown'
}

export default {
  getRiskLevel,
  getRiskColors,
  getRiskText,
  calculateBMI,
  getBMICategory,
  parseBloodPressure,
  categorizeBP
}