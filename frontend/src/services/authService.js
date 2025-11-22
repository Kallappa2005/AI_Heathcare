import api from './api'

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  async verifyToken() {
    try {
      const response = await api.get('/auth/verify-token');
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // Role-specific login methods for different user types
  async loginAsAdmin(credentials) {
    const response = await this.login(credentials);
    if (response.user.role !== 'admin') {
      this.logout();
      throw new Error('Access denied. Admin privileges required.');
    }
    return response;
  }

  async loginAsDoctor(credentials) {
    const response = await this.login(credentials);
    if (response.user.role !== 'doctor') {
      this.logout();
      throw new Error('Access denied. Doctor privileges required.');
    }
    return response;
  }

  async loginAsNurse(credentials) {
    const response = await this.login(credentials);
    if (response.user.role !== 'nurse') {
      this.logout();
      throw new Error('Access denied. Nurse privileges required.');
    }
    return response;
  }
}

export default new AuthService();