// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file extension
export const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') return ''
  return filename.split('.').pop().toLowerCase()
}

// Check if file is valid CSV
export const isValidCSV = (file) => {
  const validTypes = ['text/csv', 'application/vnd.ms-excel']
  const validExtensions = ['csv']
  
  return validTypes.includes(file.type) || 
         validExtensions.includes(getFileExtension(file.name))
}

// Check if file is valid PDF
export const isValidPDF = (file) => {
  return file.type === 'application/pdf' || 
         getFileExtension(file.name) === 'pdf'
}

// Check if file is valid image
export const isValidImage = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}

// Validate file size
export const isValidFileSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// Get file type icon
export const getFileTypeIcon = (filename) => {
  const extension = getFileExtension(filename)
  
  const icons = {
    pdf: '📄',
    csv: '📊',
    xlsx: '📊',
    xls: '📊',
    doc: '📝',
    docx: '📝',
    txt: '📄',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
  }
  
  return icons[extension] || '📄'
}

// Process CSV data for preview
export const processCSVPreview = (csvText, maxRows = 5) => {
  const lines = csvText.split('\n').filter(line => line.trim())
  const headers = lines[0]?.split(',') || []
  const rows = lines.slice(1, maxRows + 1).map(line => line.split(','))
  
  return { headers, rows, totalRows: lines.length - 1 }
}

export default {
  formatFileSize,
  getFileExtension,
  isValidCSV,
  isValidPDF,
  isValidImage,
  isValidFileSize,
  getFileTypeIcon,
  processCSVPreview
}