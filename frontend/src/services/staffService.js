// Staff service for frontend API calls
import api from './api'

class StaffService {
  constructor() {
    this.baseURL = '/staff'
  }

  /**
   * Register a new staff member
   */
  async registerStaff(staffData) {
    try {
      const response = await api.post(`${this.baseURL}/register`, staffData)
      return {
        success: true,
        message: response.data.message,
        staff: response.data.staff
      }
    } catch (error) {
      console.error('Staff registration error:', error)
      
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to register staff member')
      }
      
      throw new Error('Network error. Please check your connection.')
    }
  }

  /**
   * Get all staff members
   */
  async getStaff(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      if (filters.role) {
        params.append('role', filters.role)
      }
      
      if (filters.search) {
        params.append('search', filters.search)
      }

      const response = await api.get(`${this.baseURL}?${params}`)
      return {
        success: true,
        message: response.data.message,
        staff: response.data.staff || []
      }
    } catch (error) {
      console.error('Get staff error:', error)
      
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to get staff members')
      }
      
      throw new Error('Network error. Please check your connection.')
    }
  }

  /**
   * Get staff member by ID
   */
  async getStaffById(staffId) {
    try {
      const response = await api.get(`${this.baseURL}/${staffId}`)
      return {
        success: true,
        message: response.data.message,
        staff: response.data.staff
      }
    } catch (error) {
      console.error('Get staff by ID error:', error)
      
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to get staff member')
      }
      
      throw new Error('Network error. Please check your connection.')
    }
  }

  /**
   * Update staff member
   */
  async updateStaff(staffId, staffData) {
    try {
      const response = await api.put(`${this.baseURL}/${staffId}`, staffData)
      return {
        success: true,
        message: response.data.message,
        staff: response.data.staff
      }
    } catch (error) {
      console.error('Staff update error:', error)
      
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to update staff member')
      }
      
      throw new Error('Network error. Please check your connection.')
    }
  }

  /**
   * Delete staff member
   */
  async deleteStaff(staffId) {
    try {
      const response = await api.delete(`${this.baseURL}/${staffId}`)
      return {
        success: true,
        message: response.data.message
      }
    } catch (error) {
      console.error('Staff deletion error:', error)
      
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to delete staff member')
      }
      
      throw new Error('Network error. Please check your connection.')
    }
  }

  /**
   * Search staff members
   */
  async searchStaff(searchTerm, roleFilter = null) {
    try {
      const params = new URLSearchParams()
      params.append('q', searchTerm)
      
      if (roleFilter) {
        params.append('role', roleFilter)
      }

      const response = await api.get(`${this.baseURL}/search?${params}`)
      return {
        success: true,
        message: response.data.message,
        staff: response.data.staff || []
      }
    } catch (error) {
      console.error('Staff search error:', error)
      
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to search staff members')
      }
      
      throw new Error('Network error. Please check your connection.')
    }
  }

  /**
   * Get staff by employee ID
   */
  async getStaffByEmployeeId(employeeId) {
    try {
      const response = await api.get(`${this.baseURL}/employee/${employeeId}`)
      return {
        success: true,
        message: response.data.message,
        staff: response.data.staff
      }
    } catch (error) {
      console.error('Get staff by employee ID error:', error)
      
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to get staff member')
      }
      
      throw new Error('Network error. Please check your connection.')
    }
  }

  /**
   * Get staff statistics
   */
  async getStaffStatistics() {
    try {
      const response = await api.get(`${this.baseURL}/statistics`)
      return {
        success: true,
        message: response.data.message,
        statistics: response.data.statistics
      }
    } catch (error) {
      console.error('Get staff statistics error:', error)
      
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to get staff statistics')
      }
      
      throw new Error('Network error. Please check your connection.')
    }
  }

  /**
   * Get staff by role
   */
  async getStaffByRole(role) {
    try {
      const response = await api.get(`${this.baseURL}?role=${role}`)
      return {
        success: true,
        message: response.data.message,
        staff: response.data.staff || []
      }
    } catch (error) {
      console.error('Get staff by role error:', error)
      
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to get staff members')
      }
      
      throw new Error('Network error. Please check your connection.')
    }
  }

  /**
   * Validate staff data before submission
   */
  validateStaffData(staffData) {
    const errors = []

    if (!staffData.firstName || !staffData.firstName.trim()) {
      errors.push('First name is required')
    }

    if (!staffData.lastName || !staffData.lastName.trim()) {
      errors.push('Last name is required')
    }

    if (!staffData.email || !staffData.email.includes('@')) {
      errors.push('Valid email address is required')
    }

    if (!staffData.phone || !staffData.phone.trim()) {
      errors.push('Phone number is required')
    }

    if (!staffData.role || !staffData.role.trim()) {
      errors.push('Role is required')
    }

    if (!staffData.department || !staffData.department.trim()) {
      errors.push('Department is required')
    }

    if (!staffData.employeeId || !staffData.employeeId.trim()) {
      errors.push('Employee ID is required')
    }

    if (!staffData.dateOfJoining) {
      errors.push('Date of joining is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Format staff data for display
   */
  formatStaffForDisplay(staff) {
    return {
      ...staff,
      fullName: `${staff.firstName} ${staff.lastName}`.trim(),
      formattedJoiningDate: staff.dateOfJoining ? 
        new Date(staff.dateOfJoining).toLocaleDateString() : 'N/A',
      formattedCreatedAt: staff.createdAt ? 
        new Date(staff.createdAt).toLocaleDateString() : 'N/A'
    }
  }

  /**
   * Generate employee ID suggestion
   */
  generateEmployeeIdSuggestion(role, existingStaff = []) {
    const prefix = {
      'Doctor': 'DOC',
      'Nurse': 'NUR', 
      'Admin': 'ADM',
      'Technician': 'TEC'
    }[role] || 'STF'

    const existingIds = existingStaff
      .filter(staff => staff.employeeId && staff.employeeId.startsWith(prefix))
      .map(staff => {
        const match = staff.employeeId.match(new RegExp(`${prefix}(\\d+)`))
        return match ? parseInt(match[1], 10) : 0
      })

    const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`
  }
}

const staffService = new StaffService()
export default staffService