export interface CourierService {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  serviceAreas: string[];
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  courierService: CourierService;
  token: string;
}
