// import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Mock API client for development (when backend is not ready)
export const apiClient = {
  get: async (url: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  },
  post: async (url: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  },
  put: async (url: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  },
  delete: async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  }
};

// Mock API client for development (when backend is not ready)
export const mockApiClient = {
  get: async (url: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  },
  post: async (url: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  },
  put: async (url: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  },
  delete: async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  }
};

export default apiClient;
