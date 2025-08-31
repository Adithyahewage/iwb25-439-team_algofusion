// import apiClient from './client';
import { LoginCredentials, AuthResponse, User } from '../types/courier';

// Mock user data for development
const mockUser: User = {
  id: '1',
  email: 'admin@trackme.com',
  name: 'Admin User',
  role: 'admin',
  permissions: ['read', 'write', 'delete'],
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

const mockCourierService = {
  id: '1',
  name: 'Demo Courier Service',
  email: 'info@democourier.com',
  phone: '+1234567890',
  address: '123 Main St, Colombo, Sri Lanka',
  logo: '',
  serviceAreas: ['Colombo', 'Galle', 'Kandy'],
  users: [mockUser],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const authApi = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'admin@trackme.com' && credentials.password === 'password') {
      const mockResponse: AuthResponse = {
        user: mockUser,
        courierService: mockCourierService,
        token: 'mock-jwt-token-' + Date.now()
      };
      return mockResponse;
    } else {
      throw new Error('Invalid credentials');
    }
  },

  // Logout user
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock logout - just clear local storage
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUser;
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockUser, ...data };
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  // Get stored auth data
  getAuthData(): { token: string; user: User } | null {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      return {
        token,
        user: JSON.parse(userData)
      };
    }
    return null;
  },

  // Store auth data
  setAuthData(token: string, user: User): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  // Clear auth data
  clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
};
