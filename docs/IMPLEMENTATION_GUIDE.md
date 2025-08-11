# 🚀 TrackMe - Implementation Guide

## 🎯 **Project Overview**

This guide will walk you through implementing **TrackMe**, a courier service parcel tracking system built with Ballerina backend and Next.js frontend. The system enables multiple courier services to register, manage parcels, and share tracking information with customers through WhatsApp links.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Ballerina     │    │   MongoDB       │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • Admin Dashboard│    │ • REST APIs     │    │ • Document Store│
│ • Public Tracking│    │ • Authentication│    │ • Multi-tenant  │
│ • WhatsApp Links│    │ • Parcel Mgmt   │    │ • Status Updates│
│ • Mobile UI     │    │ • Notifications │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 **Implementation Phases**

### **Phase 1: Backend Foundation (Week 1)**
- [ ] Ballerina project setup
- [ ] MongoDB connection and models
- [ ] Basic CRUD operations
- [ ] Authentication system

### **Phase 2: Core Features (Week 2)**
- [ ] Parcel management APIs
- [ ] Status update system
- [ ] Frontend setup
- [ ] Admin dashboard

### **Phase 3: Customer Features (Week 3)**
- [ ] Public tracking pages
- [ ] WhatsApp integration
- [ ] Testing and deployment
- [ ] Documentation

## 🔧 **Backend Implementation (Ballerina)**

### **1. Project Setup**

```bash
# Create Ballerina project
bal new trackme-backend
cd trackme-backend
```

**Ballerina.toml Configuration:**
```toml
[project]
org-name = "trackme"
name = "trackme-backend"
version = "1.0.0"

[build-options]
observabilityIncluded = true

[[dependency]]
org = "ballerina"
name = "http"
version = "2.8.0"

[[dependency]]
org = "ballerina" 
name = "mongodb"
version = "1.0.0"

[[dependency]]
org = "ballerina"
name = "jwt"
version = "2.8.0"

[[dependency]]
org = "ballerina"
name = "bcrypt"
version = "1.0.0"
```

### **2. Data Models**

**`src/models/courier_service.bal`:**
```ballerina
public type CourierService record {
    string id;
    string name;
    string email;
    string phone;
    string address;
    string logo;
    string[] serviceAreas;
    User[] users;
    time:Utc createdAt;
    time:Utc updatedAt;
};

public type User record {
    string id;
    string email;
    string name;
    string role;
    string[] permissions;
    time:Utc createdAt;
    time:Utc lastLogin;
};
```

**`src/models/parcel.bal`:**
```ballerina
public type Parcel record {
    string id;
    string trackingNumber;
    string courierServiceId;
    Sender sender;
    Recipient recipient;
    Item item;
    string status;
    StatusUpdate[] statusHistory;
    LocationPoint[] locationHistory;
    time:Utc estimatedDelivery;
    time:Utc createdAt;
    time:Utc updatedAt;
};

public type Sender record {
    string name;
    string email;
    string phone;
    string address;
};

public type Recipient record {
    string name;
    string email;
    string phone;
    string address;
};

public type Item record {
    string description;
    decimal weight;
    Dimensions dimensions;
    string category;
};

public type Dimensions record {
    decimal length;
    decimal width;
    decimal height;
};

public type StatusUpdate record {
    string status;
    string location;
    string notes;
    time:Utc timestamp;
    string updatedBy;
};

public type LocationPoint record {
    decimal latitude;
    decimal longitude;
    string address;
    time:Utc timestamp;
    string status;
};
```

### **3. Database Configuration**

**`src/config/database.bal`:**
```ballerina
import ballerina/mongodb;

public type DatabaseConfig record {
    string uri;
    string database;
    string username;
    string password;
};

public function getDatabaseConfig() returns DatabaseConfig {
    return {
        uri: "mongodb://localhost:27017",
        database: "trackme",
        username: "admin",
        password: "password"
    };
}

public function getMongoClient() returns mongodb:Client|error {
    DatabaseConfig config = getDatabaseConfig();
    return new mongodb:Client(config.uri, {
        username: config.username,
        password: config.password,
        database: config.database
    });
}
```

### **4. Core Services**

**`src/services/courier_service.bal`:**
```ballerina
import ballerina/http;
import ballerina/mongodb;
import ballerina/uuid;

@http:ServiceConfig {
    basePath: "/api/v1/courier-services"
}
service class CourierServiceService {
    private final mongodb:Client mongoClient;
    
    public function init() returns error? {
        self.mongoClient = getMongoClient();
    }
    
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/"
    }
    remote function registerCourierService(http:Request req) returns http:Response|http:BadRequest|http:InternalServerError {
        // Implementation for courier service registration
    }
    
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/{id}"
    }
    remote function getCourierService(string id) returns http:Response|http:NotFound|http:InternalServerError {
        // Implementation for getting courier service details
    }
    
    // Additional CRUD operations...
}
```

**`src/services/parcel_service.bal`:**
```ballerina
import ballerina/http;
import ballerina/mongodb;

@http:ServiceConfig {
    basePath: "/api/v1/parcels"
}
service class ParcelService {
    private final mongodb:Client mongoClient;
    
    public function init() returns error? {
        self.mongoClient = getMongoClient();
    }
    
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/"
    }
    remote function createParcel(http:Request req) returns http:Response|http:BadRequest|http:InternalServerError {
        // Implementation for creating new parcels
    }
    
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    remote function getParcels(http:Request req) returns http:Response|http:InternalServerError {
        // Implementation for listing parcels
    }
    
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/{id}/status"
    }
    remote function updateStatus(string id, http:Request req) returns http:Response|http:BadRequest|http:NotFound|http:InternalServerError {
        // Implementation for updating parcel status
    }
    
    // Additional CRUD operations...
}
```

**`src/services/tracking_service.bal`:**
```ballerina
import ballerina/http;

@http:ServiceConfig {
    basePath: "/api/v1/tracking"
}
service class TrackingService {
    private final mongodb:Client mongoClient;
    
    public function init() returns error? {
        self.mongoClient = getMongoClient();
    }
    
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/{trackingNumber}"
    }
    remote function trackParcel(string trackingNumber) returns http:Response|http:NotFound|http:InternalServerError {
        // Implementation for public parcel tracking
    }
    
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/{trackingNumber}/status"
    }
    remote function getParcelStatus(string trackingNumber) returns http:Response|http:NotFound|http:InternalServerError {
        // Implementation for getting current status
    }
}
```

### **5. Authentication Service**

**`src/services/auth_service.bal`:**
```ballerina
import ballerina/http;
import ballerina/jwt;
import ballerina/bcrypt;
import ballerina/time;

@http:ServiceConfig {
    basePath: "/api/v1/auth"
}
service class AuthService {
    private final mongodb:Client mongoClient;
    private final string jwtSecret;
    
    public function init() returns error? {
        self.mongoClient = getMongoClient();
        self.jwtSecret = "your-secret-key-here";
    }
    
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/login"
    }
    remote function login(http:Request req) returns http:Response|http:BadRequest|http:Unauthorized|http:InternalServerError {
        // Implementation for user authentication
    }
    
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/logout"
    }
    remote function logout(http:Request req) returns http:Response|http:InternalServerError {
        // Implementation for user logout
    }
    
    // Additional authentication methods...
}
```

## 🎨 **Frontend Implementation (Next.js)**

### **1. Project Setup**

```bash
# Create Next.js project
npx create-next-app@latest trackme-frontend --typescript --tailwind --app --src-dir
cd trackme-frontend
```

**Package Dependencies:**
```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.0.0",
    "react-dom": "18.0.0",
    "typescript": "5.0.0",
    "tailwindcss": "3.3.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zustand": "^4.4.0",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@types/node": "20.0.0",
    "@types/react": "18.0.0",
    "@types/react-dom": "18.0.0",
    "eslint": "8.0.0",
    "eslint-config-next": "14.0.0"
  }
}
```

### **2. Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard (protected)
│   │   ├── login/         # Admin login page
│   │   ├── dashboard/     # Main admin dashboard
│   │   ├── parcels/       # Parcel management
│   │   └── profile/       # Courier service profile
│   ├── tracking/          # Public tracking pages
│   │   └── [trackingNumber]/ # Individual parcel tracking
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/             # Reusable React components
│   ├── admin/             # Admin-specific components
│   ├── tracking/          # Tracking-specific components
│   ├── common/            # Shared components
│   └── ui/                # UI component library
├── lib/                   # Utility functions and configurations
│   ├── api/               # API client functions
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript type definitions
└── styles/                # CSS and styling files
```

### **3. Type Definitions**

**`src/lib/types/courier.ts`:**
```typescript
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
```

**`src/lib/types/parcel.ts`:**
```typescript
export interface Parcel {
  id: string;
  trackingNumber: string;
  courierServiceId: string;
  sender: Sender;
  recipient: Recipient;
  item: Item;
  status: string;
  statusHistory: StatusUpdate[];
  locationHistory: LocationPoint[];
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sender {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Recipient {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Item {
  description: string;
  weight: number;
  dimensions: Dimensions;
  category: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface StatusUpdate {
  status: string;
  location: string;
  notes?: string;
  timestamp: string;
  updatedBy: string;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
  status: string;
}
```

### **4. API Client Functions**

**`src/lib/api/courier.ts`:**
```typescript
import axios from 'axios';
import { CourierService, User } from '../types/courier';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const courierApi = {
  // Register new courier service
  async register(data: Omit<CourierService, 'id' | 'createdAt' | 'updatedAt'>): Promise<CourierService> {
    const response = await axios.post(`${API_BASE_URL}/courier-services`, data);
    return response.data;
  },

  // Get courier service details
  async getById(id: string): Promise<CourierService> {
    const response = await axios.get(`${API_BASE_URL}/courier-services/${id}`);
    return response.data;
  },

  // Update courier service
  async update(id: string, data: Partial<CourierService>): Promise<CourierService> {
    const response = await axios.put(`${API_BASE_URL}/courier-services/${id}`, data);
    return response.data;
  },

  // Delete courier service
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/courier-services/${id}`);
  }
};
```

**`src/lib/api/parcels.ts`:**
```typescript
import axios from 'axios';
import { Parcel, StatusUpdate } from '../types/parcel';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const parcelApi = {
  // Create new parcel
  async create(data: Omit<Parcel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Parcel> {
    const response = await axios.post(`${API_BASE_URL}/parcels`, data);
    return response.data;
  },

  // Get all parcels for courier service
  async getAll(courierServiceId: string): Promise<Parcel[]> {
    const response = await axios.get(`${API_BASE_URL}/parcels?courierServiceId=${courierServiceId}`);
    return response.data;
  },

  // Get parcel by ID
  async getById(id: string): Promise<Parcel> {
    const response = await axios.get(`${API_BASE_URL}/parcels/${id}`);
    return response.data;
  },

  // Update parcel
  async update(id: string, data: Partial<Parcel>): Promise<Parcel> {
    const response = await axios.put(`${API_BASE_URL}/parcels/${id}`, data);
    return response.data;
  },

  // Delete parcel
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/parcels/${id}`);
  },

  // Update parcel status
  async updateStatus(id: string, statusUpdate: Omit<StatusUpdate, 'timestamp'>): Promise<Parcel> {
    const response = await axios.post(`${API_BASE_URL}/parcels/${id}/status`, statusUpdate);
    return response.data;
  }
};
```

**`src/lib/api/tracking.ts`:**
```typescript
import axios from 'axios';
import { Parcel } from '../types/parcel';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const trackingApi = {
  // Get parcel tracking info (public)
  async trackParcel(trackingNumber: string): Promise<Parcel> {
    const response = await axios.get(`${API_BASE_URL}/tracking/${trackingNumber}`);
    return response.data;
  },

  // Get current parcel status (public)
  async getParcelStatus(trackingNumber: string): Promise<{ status: string; location: string; estimatedDelivery: string }> {
    const response = await axios.get(`${API_BASE_URL}/tracking/${trackingNumber}/status`);
    return response.data;
  }
};
```

### **5. Key Components**

**Admin Dashboard (`src/components/admin/Dashboard.tsx`):**
```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { Parcel } from '@/lib/types/parcel';
import { parcelApi } from '@/lib/api/parcels';
import ParcelList from './ParcelList';
import StatusOverview from './StatusOverview';

export default function Dashboard() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = async () => {
    try {
      // In a real app, get courierServiceId from auth context
      const courierServiceId = 'temp-id';
      const data = await parcelApi.getAll(courierServiceId);
      setParcels(data);
    } catch (error) {
      console.error('Failed to load parcels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <StatusOverview parcels={parcels} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Parcels</h2>
        <ParcelList parcels={parcels.slice(0, 10)} onRefresh={loadParcels} />
      </div>
    </div>
  );
}
```

**Public Tracking Page (`src/components/tracking/TrackingPage.tsx`):**
```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { Parcel } from '@/lib/types/parcel';
import { trackingApi } from '@/lib/api/tracking';
import ParcelInfo from './ParcelInfo';
import StatusTimeline from './StatusTimeline';
import WhatsAppShare from './WhatsAppShare';

interface TrackingPageProps {
  trackingNumber: string;
}

export default function TrackingPage({ trackingNumber }: TrackingPageProps) {
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParcel();
  }, [trackingNumber]);

  const loadParcel = async () => {
    try {
      setLoading(true);
      const data = await trackingApi.trackParcel(trackingNumber);
      setParcel(data);
      setError(null);
    } catch (error) {
      setError('Parcel not found or tracking number is invalid');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tracking information...</div>;
  }

  if (error || !parcel) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <p>Please check your tracking number and try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Track Your Parcel</h1>
          <p className="text-gray-600 mt-2">Tracking Number: {trackingNumber}</p>
        </div>

        <ParcelInfo parcel={parcel} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Delivery Progress</h2>
          <StatusTimeline statusHistory={parcel.statusHistory} />
        </div>

        <div className="mt-8 text-center">
          <WhatsAppShare trackingNumber={trackingNumber} />
        </div>
      </div>
    </div>
  );
}
```

## 🗄️ **Database Setup**

### **1. MongoDB Collections**

```javascript
// Create database
use trackme

// Create collections with validation
db.createCollection("courier_services", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "phone", "address"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        phone: { bsonType: "string" },
        address: { bsonType: "string" }
      }
    }
  }
});

db.createCollection("parcels", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["trackingNumber", "courierServiceId", "sender", "recipient", "item", "status"],
      properties: {
        trackingNumber: { bsonType: "string" },
        courierServiceId: { bsonType: "objectId" },
        status: { bsonType: "string" }
      }
    }
  }
});

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["courierServiceId", "email", "name", "role"],
      properties: {
        email: { bsonType: "string" },
        role: { bsonType: "string" }
      }
    }
  }
});
```

### **2. Database Indexes**

```javascript
// Create indexes for performance
db.parcels.createIndex({ "trackingNumber": 1 }, { unique: true });
db.parcels.createIndex({ "courierServiceId": 1 });
db.parcels.createIndex({ "status": 1 });
db.parcels.createIndex({ "createdAt": -1 });

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "courierServiceId": 1 });

db.courier_services.createIndex({ "email": 1 }, { unique: true });
```

## 🐳 **Docker Configuration**

### **1. Backend Dockerfile**

```dockerfile
# backend/Dockerfile
FROM ballerina/ballerina:2201.8.0

WORKDIR /app

# Copy project files
COPY . .

# Build the project
RUN bal build

# Expose port
EXPOSE 8080

# Run the service
CMD ["bal", "run", "target/bin/trackme.jar"]
```

### **2. Frontend Dockerfile**

```dockerfile
# frontend/trackme/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### **3. Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'
services:
  # MongoDB Database
  mongodb:
    image: mongo:7.0
    container_name: trackme_mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: trackme
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./scripts/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro

  # Ballerina Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: trackme_backend
    restart: unless-stopped
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/trackme?authSource=admin
      JWT_SECRET: your_jwt_secret_here
      PORT: 8080
    ports:
      - "8080:8080"
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app
      - /app/target

  # Next.js Frontend
  frontend:
    build:
      context: ./frontend/trackme
      dockerfile: Dockerfile
    container_name: trackme_frontend
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080/api/v1
      NEXT_PUBLIC_WHATSAPP_API_KEY: your_whatsapp_api_key
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## 🧪 **Testing Strategy**

### **1. Backend Testing**

```bash
# Run all tests
cd backend
bal test

# Run specific test files
bal test --tests test_parcel_service_test.bal

# Run with coverage
bal test --code-coverage
```

### **2. Frontend Testing**

```bash
# Run all tests
cd frontend/trackme
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### **3. Integration Testing**

```bash
# Start all services
docker-compose up -d

# Run integration tests
npm run test:integration

# Stop services
docker-compose down
```

## 🚀 **Deployment**

### **1. Production Build**

```bash
# Backend
cd backend
bal build
bal run target/bin/trackme.jar

# Frontend
cd frontend/trackme
npm run build
npm start
```

### **2. Docker Deployment**

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 📚 **Next Steps**

1. **Complete Backend Implementation**: Finish all service implementations
2. **Frontend Components**: Build remaining React components
3. **WhatsApp Integration**: Implement tracking link generation
4. **Testing**: Comprehensive testing of all features
5. **Documentation**: API documentation and user guides
6. **Deployment**: Production deployment and monitoring

---

**This implementation guide provides the foundation for building TrackMe. Follow the phases sequentially to ensure a solid foundation and successful delivery.** 🚀 