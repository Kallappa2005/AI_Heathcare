import { format, formatDistanceToNow, parseISO } from 'date-fns'

// Format date for display
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Format date with time
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy - h:mm a')
}

// Check if date is today
export const isToday = (date) => {
  if (!date) return false
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  return dateObj.toDateString() === today.toDateString()
}

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0
  const dob = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  
  return age
}

export default {
  formatDate,
  formatRelativeTime,
  formatDateTime,
  isToday,
  calculateAge
}