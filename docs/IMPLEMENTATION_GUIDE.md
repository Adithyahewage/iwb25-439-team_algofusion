# 🛠️ TrackMe - Implementation Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Ballerina 2201.8.0+, Docker, MongoDB knowledge

### Setup Commands
```bash
# Backend
cd backend
bal init trackme-backend

# Frontend  
cd frontend
npx create-next-app@latest trackme --typescript --tailwind --eslint --app
```

---

## 🏗️ Backend Implementation (Ballerina)

### 1. Dependencies (Ballerina.toml)
```toml
[[dependency]]
org = "ballerina"
name = "http"
version = "2.8.0"

[[dependency]]
org = "ballerina" 
name = "mongodb"
version = "1.8.0"

[[dependency]]
org = "ballerina"
name = "email"
version = "2.8.0"
```

### 2. Core Data Model (src/models/parcel.bal)
```ballerina
public type Parcel record {
    string id;
    Sender sender;
    Recipient recipient;
    Item item;
    GeoPoint pickupLocation;
    GeoPoint deliveryLocation;
    string status;
    StatusUpdate[] statusHistory;
    LocationPoint[] locationHistory;
    Delivery delivery;
    Metadata metadata;
};

public type GeoPoint record {
    float latitude;
    float longitude;
    string? address;
};
```

### 3. Main Service (src/services/tracking_service.bal)
```ballerina
@http:ServiceConfig {
    basePath: "/api/v1"
}
service class TrackingService {
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/parcels"
    }
    resource function createParcel(http:Caller caller, http:Request request) returns error? {
        // Implementation here
    }
    
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/parcels/{id}"
    }
    resource function getParcel(http:Caller caller, http:Request request, string id) returns error? {
        // Implementation here
    }
}
```

---

## 🎨 Frontend Implementation (Next.js)

### 1. Dependencies
```bash
npm install @mapbox/mapbox-gl-react mapbox-gl
npm install @headlessui/react @heroicons/react
npm install swr axios react-hook-form
```

### 2. Main Dashboard (src/app/page.tsx)
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Parcel } from '@/lib/types';
import ParcelCard from '@/components/ui/ParcelCard';
import TrackingMap from '@/components/maps/TrackingMap';

export default function Dashboard() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">TrackMe Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Parcels</h2>
              {parcels.map((parcel) => (
                <ParcelCard key={parcel.id} parcel={parcel} />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Live Tracking Map</h2>
              <TrackingMap parcels={parcels} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Parcel Card Component
```typescript
interface ParcelCardProps {
  parcel: Parcel;
}

export default function ParcelCard({ parcel }: ParcelCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{parcel.metadata.trackingNumber}</h3>
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {parcel.status}
        </span>
      </div>
      <p className="text-sm text-gray-600">{parcel.item.description}</p>
    </div>
  );
}
```

---

## 🗄️ Database Setup

### MongoDB Collections
```javascript
// Initialize database
db = db.getSiblingDB('trackme');

// Create collections
db.createCollection('parcels');
db.createCollection('users');
db.createCollection('notifications');

// Create geospatial index
db.parcels.createIndex({ "currentLocation.coordinates": "2dsphere" });
```

---

## 🔧 Development Phases

### Week 1: Foundation
- [ ] Backend project structure
- [ ] Basic data models
- [ ] MongoDB integration
- [ ] CRUD APIs

### Week 2: Core Features  
- [ ] Location tracking
- [ ] Frontend setup
- [ ] Map integration
- [ ] User interface

### Week 3: Polish & Deploy
- [ ] Notification system
- [ ] Testing & optimization
- [ ] Docker deployment
- [ ] Documentation

---

## 🚀 Quick Commands

### Backend
```bash
cd backend
bal build          # Build project
bal test           # Run tests
bal run            # Start service
```

### Frontend
```bash
cd frontend/trackme
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
```

### Database
```bash
docker-compose up -d mongodb    # Start MongoDB
docker exec -it trackme-mongodb-1 mongosh  # Connect to DB
```

---

## 📋 Testing Checklist

- [ ] Backend compiles without errors
- [ ] API endpoints respond correctly
- [ ] Frontend builds successfully
- [ ] Database queries perform well
- [ ] Map renders with parcel locations
- [ ] All user interactions work

---

**Ready to build TrackMe? Start with the backend foundation! 🚀** 