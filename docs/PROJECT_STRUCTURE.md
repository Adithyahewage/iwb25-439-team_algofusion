# 🏗️ TrackMe - Project Structure Document

## 📁 Directory Structure Overview

```
TrackMe/
├── 📁 backend/                 # Ballerina backend services
│   ├── 📁 src/
│   │   ├── 📁 models/         # Data type definitions
│   │   ├── 📁 services/       # HTTP service implementations
│   │   ├── 📁 utils/          # Helper functions
│   │   └── 📁 config/         # Configuration files
│   ├── 📁 tests/              # Test files
│   └── Ballerina.toml         # Project configuration
├── 📁 frontend/                # Next.js frontend application
│   └── 📁 trackme/            # Next.js app directory
├── 📁 docs/                    # Project documentation
├── 📁 scripts/                 # Setup and utility scripts
├── 📁 .github/                 # GitHub workflows and templates
├── docker-compose.yml          # Multi-service Docker setup
├── README.md                   # Project overview
└── .gitignore                  # Git ignore rules
```

---

## 🔧 Backend Structure (Ballerina)

### **Core Directory Layout**
```
backend/
├── 📁 src/
│   ├── 📁 models/             # Data models and types
│   │   ├── courier_service.bal    # Courier service data types
│   │   ├── parcel.bal             # Parcel data types
│   │   ├── user.bal               # User management types
│   │   ├── status_update.bal      # Status update types
│   │   └── common.bal             # Shared types and utilities
│   ├── 📁 services/           # HTTP service implementations
│   │   ├── courier_service.bal    # Courier service management
│   │   ├── parcel_service.bal     # Parcel CRUD operations
│   │   ├── tracking_service.bal   # Public tracking endpoints
│   │   ├── auth_service.bal       # Authentication and authorization
│   │   └── notification_service.bal # WhatsApp integration
│   ├── 📁 utils/              # Helper functions and utilities
│   │   ├── database.bal           # MongoDB connection and operations
│   │   ├── auth.bal               # JWT and authentication utilities
│   │   ├── validation.bal         # Input validation helpers
│   │   ├── whatsapp.bal           # WhatsApp link generation
│   │   └── response.bal           # Standardized API responses
│   └── 📁 config/             # Configuration and constants
│       ├── database.bal            # Database configuration
│       ├── auth.bal                # Authentication configuration
│       └── app.bal                 # Application constants
├── 📁 tests/                  # Test files
│   ├── 📁 unit/                   # Unit tests
│   ├── 📁 integration/            # Integration tests
│   └── 📁 performance/            # Performance tests
├── Ballerina.toml             # Project configuration
├── .env                       # Environment variables
└── README.md                  # Backend-specific documentation
```

### **Service Architecture**

#### **1. Courier Service Management (`courier_service.bal`)**
- **Registration:** New courier service account creation
- **Profile Management:** Update company details and branding
- **User Management:** Staff account creation and permissions
- **Service Areas:** Define delivery zones and coverage

#### **2. Parcel Management (`parcel_service.bal`)**
- **CRUD Operations:** Create, read, update, delete parcels
- **Status Updates:** Track delivery progress and location
- **Bulk Operations:** Import multiple parcels
- **Search & Filter:** Find parcels by various criteria

#### **3. Public Tracking (`tracking_service.bal`)**
- **Customer Access:** Public endpoints for parcel tracking
- **Status Queries:** Get current delivery status
- **Timeline Generation:** Delivery progress history
- **WhatsApp Integration:** Generate shareable tracking links

#### **4. Authentication (`auth_service.bal`)**
- **Admin Login:** JWT-based authentication for courier staff
- **Role Management:** Permission-based access control
- **Session Management:** Secure token handling
- **Password Security:** bcrypt hashing and validation

#### **5. Notifications (`notification_service.bal`)**
- **WhatsApp Links:** Generate tracking URLs for sharing
- **Email Notifications:** Status update alerts
- **SMS Integration:** Optional text message updates
- **Webhook Support:** Real-time external system updates

### **Data Models**

#### **Courier Service Model**
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
```

#### **Parcel Model**
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
```

#### **Status Update Model**
```ballerina
public type StatusUpdate record {
    string status;
    string location;
    string notes;
    time:Utc timestamp;
    string updatedBy;
};
```

---

## 🎨 Frontend Structure (Next.js)

### **App Router Structure**
```
frontend/trackme/
├── 📁 src/
│   ├── 📁 app/                # Next.js 14 App Router
│   │   ├── 📁 admin/          # Admin dashboard (protected)
│   │   │   ├── login/         # Admin login page
│   │   │   ├── dashboard/     # Main admin dashboard
│   │   │   ├── parcels/       # Parcel management
│   │   │   │   ├── page.tsx   # Parcel list
│   │   │   │   ├── new/       # Create new parcel
│   │   │   │   └── [id]/      # Edit existing parcel
│   │   │   └── profile/       # Courier service profile
│   │   ├── 📁 tracking/       # Public tracking pages
│   │   │   └── [trackingNumber]/ # Individual parcel tracking
│   │   ├── 📁 api/            # API routes
│   │   │   └── 📁 webhooks/   # Webhook endpoints
│   │   ├── favicon.ico        # App icon
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── 📁 components/         # Reusable React components
│   │   ├── 📁 admin/          # Admin-specific components
│   │   │   ├── Dashboard.tsx      # Main dashboard
│   │   │   ├── ParcelList.tsx     # Parcel management table
│   │   │   ├── ParcelForm.tsx     # Create/edit parcel form
│   │   │   ├── StatusUpdater.tsx  # Status update interface
│   │   │   └── ProfileEditor.tsx  # Profile management
│   │   ├── 📁 tracking/       # Tracking-specific components
│   │   │   ├── TrackingPage.tsx   # Public tracking interface
│   │   │   ├── StatusTimeline.tsx # Delivery progress timeline
│   │   │   ├── ParcelInfo.tsx     # Parcel details display
│   │   │   └── WhatsAppShare.tsx  # WhatsApp sharing component
│   │   ├── 📁 common/         # Shared components
│   │   │   ├── Header.tsx         # Navigation header
│   │   │   ├── Footer.tsx         # Page footer
│   │   │   ├── Loading.tsx        # Loading states
│   │   │   └── ErrorBoundary.tsx  # Error handling
│   │   └── 📁 ui/             # UI component library
│   │       ├── Button.tsx          # Button components
│   │       ├── Input.tsx           # Form inputs
│   │       ├── Modal.tsx           # Modal dialogs
│   │       └── Table.tsx           # Data tables
│   ├── 📁 lib/                # Utility functions and configurations
│   │   ├── 📁 api/                # API client functions
│   │   │   ├── courier.ts          # Courier service API calls
│   │   │   ├── parcels.ts          # Parcel API calls
│   │   │   ├── tracking.ts         # Tracking API calls
│   │   │   └── auth.ts             # Authentication API calls
│   │   ├── 📁 utils/               # Helper functions
│   │   │   ├── validation.ts       # Form validation
│   │   │   ├── formatting.ts       # Data formatting
│   │   │   ├── whatsapp.ts         # WhatsApp link generation
│   │   │   └── constants.ts        # Application constants
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   │   ├── useAuth.ts          # Authentication state
│   │   │   ├── useParcels.ts       # Parcel data management
│   │   │   └── useTracking.ts      # Tracking data management
│   │   └── 📁 types/               # TypeScript type definitions
│   │       ├── courier.ts              # Courier service types
│   │       ├── parcel.ts              # Parcel types
│   │       ├── user.ts                # User types
│   │       └── api.ts                 # API response types
│   ├── 📁 styles/              # CSS and styling files
│   │   ├── components.css           # Component-specific styles
│   │   └── utilities.css            # Utility classes
│   └── 📁 public/              # Static assets
│       ├── 📁 images/               # Image files
│       ├── 📁 icons/                # Icon files
│       └── 📁 fonts/                # Font files
├── 📁 tests/                   # Test files
│   ├── 📁 components/              # Component tests
│   ├── 📁 pages/                  # Page tests
│   └── 📁 utils/                   # Utility function tests
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Frontend-specific documentation
```

### **Key Page Components**

#### **Admin Dashboard (`/admin/dashboard`)**
- **Overview Cards:** Total parcels, active deliveries, completed deliveries
- **Recent Activity:** Latest status updates and changes
- **Quick Actions:** Create new parcel, update status, view reports
- **Performance Metrics:** Delivery success rates and timing

#### **Parcel Management (`/admin/parcels`)**
- **Data Table:** List all parcels with search and filtering
- **Status Indicators:** Visual status representation
- **Action Buttons:** Edit, delete, update status
- **Bulk Operations:** Import/export functionality

#### **Public Tracking (`/tracking/[trackingNumber]`)**
- **Parcel Information:** Sender, recipient, item details
- **Status Timeline:** Visual delivery progress
- **Current Status:** Latest delivery information
- **WhatsApp Share:** Generate and share tracking link

---

## 🗄️ Database Structure (MongoDB)

### **Collection Schema**

#### **Courier Services Collection**
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "logo": "string",
  "serviceAreas": ["string"],
  "users": [
    {
      "id": "ObjectId",
      "email": "string",
      "name": "string",
      "role": "string",
      "permissions": ["string"]
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### **Parcels Collection**
```json
{
  "_id": "ObjectId",
  "trackingNumber": "string",
  "courierServiceId": "ObjectId",
  "sender": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
  },
  "recipient": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
  },
  "item": {
    "description": "string",
    "weight": "number",
    "dimensions": {
      "length": "number",
      "width": "number",
      "height": "number"
    },
    "category": "string"
  },
  "status": "string",
  "statusHistory": [
    {
      "status": "string",
      "location": "string",
      "notes": "string",
      "timestamp": "Date",
      "updatedBy": "string"
    }
  ],
  "locationHistory": [
    {
      "latitude": "number",
      "longitude": "number",
      "address": "string",
      "timestamp": "Date",
      "status": "string"
    }
  ],
  "estimatedDelivery": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### **Users Collection**
```json
{
  "_id": "ObjectId",
  "courierServiceId": "ObjectId",
  "email": "string",
  "passwordHash": "string",
  "name": "string",
  "role": "string",
  "permissions": ["string"],
  "createdAt": "Date",
  "lastLogin": "Date"
}
```

#### **Status Updates Collection**
```json
{
  "_id": "ObjectId",
  "parcelId": "ObjectId",
  "status": "string",
  "location": "string",
  "notes": "string",
  "timestamp": "Date",
  "updatedBy": "string",
  "metadata": {}
}
```

### **Database Indexes**
- **Tracking Numbers:** Unique index on parcel tracking numbers
- **Courier Service:** Index on courier service ID for fast queries
- **Status Updates:** Index on timestamp for chronological queries
- **User Authentication:** Index on email for login operations

---

## 🐳 Docker Configuration

### **Multi-Service Setup**
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

### **Backend Dockerfile**
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

### **Frontend Dockerfile**
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

---

## 🔄 API Endpoints Structure

### **Core API Routes**

#### **Courier Service Management**
```
POST   /api/v1/courier-services          # Register new courier service
GET    /api/v1/courier-services/{id}     # Get courier service details
PUT    /api/v1/courier-services/{id}     # Update courier service
DELETE /api/v1/courier-services/{id}     # Delete courier service
```

#### **Parcel Management**
```
POST   /api/v1/parcels                   # Create new parcel
GET    /api/v1/parcels                   # List all parcels for courier service
GET    /api/v1/parcels/{id}              # Get parcel details
PUT    /api/v1/parcels/{id}              # Update parcel
DELETE /api/v1/parcels/{id}              # Delete parcel
```

#### **Status Updates**
```
POST   /api/v1/parcels/{id}/status      # Update parcel status
GET    /api/v1/parcels/{id}/history     # Get status history
GET    /api/v1/parcels/{id}/timeline    # Get delivery timeline
```

#### **Customer Tracking (Public)**
```
GET    /api/v1/tracking/{trackingNumber} # Get parcel tracking info
GET    /api/v1/tracking/{trackingNumber}/status  # Get current status
```

#### **Authentication**
```
POST   /api/v1/auth/login                # Admin login
POST   /api/v1/auth/logout               # Admin logout
GET    /api/v1/auth/profile              # Get user profile
PUT    /api/v1/auth/profile              # Update profile
```

---

## 🧪 Testing Structure

### **Backend Testing**
```
backend/tests/
├── 📁 unit/                    # Unit tests
│   ├── 📁 services/               # Service layer tests
│   ├── 📁 utils/                  # Utility function tests
│   └── 📁 models/                 # Data model tests
├── 📁 integration/             # Integration tests
│   ├── 📁 api/                    # API endpoint tests
│   ├── 📁 database/               # Database operation tests
│   └── 📁 auth/                   # Authentication tests
└── 📁 performance/             # Performance tests
    ├── 📁 load/                   # Load testing
    └── 📁 stress/                 # Stress testing
```

### **Frontend Testing**
```
frontend/trackme/tests/
├── 📁 components/               # Component tests
│   ├── 📁 admin/                    # Admin component tests
│   ├── 📁 tracking/                 # Tracking component tests
│   └── 📁 common/                   # Common component tests
├── 📁 pages/                    # Page tests
│   ├── 📁 admin/                    # Admin page tests
│   └── 📁 tracking/                 # Tracking page tests
└── 📁 utils/                     # Utility function tests
    ├── 📁 api/                       # API function tests
    ├── 📁 validation/                # Validation tests
    └── 📁 formatting/                # Formatting tests
```

---

## 📚 Documentation Structure

### **Project Documentation**
```
docs/
├── PROJECT_SPECIFICATION.md        # Detailed project requirements
├── PROJECT_STRUCTURE.md            # This document
├── PROJECT_SUMMARY.md              # High-level project overview
├── IMPLEMENTATION_GUIDE.md         # Development instructions
├── API_DOCUMENTATION.md            # API endpoint specifications
├── DEPLOYMENT_GUIDE.md             # Deployment instructions
└── USER_GUIDE.md                  # End-user documentation
```

### **Code Documentation**
- **Inline Comments:** Comprehensive code documentation
- **API Documentation:** OpenAPI/Swagger specifications
- **Component Documentation:** Storybook for React components
- **Database Schema:** MongoDB collection documentation

---

## 🚀 Development Workflow

### **Local Development Setup**
1. **Clone Repository:** `git clone <repository-url>`
2. **Install Dependencies:** Backend and frontend package installation
3. **Start MongoDB:** `docker-compose up mongodb`
4. **Start Backend:** `bal run` in backend directory
5. **Start Frontend:** `npm run dev` in frontend directory

### **Testing Workflow**
1. **Unit Tests:** Run before each commit
2. **Integration Tests:** Run before merging to main
3. **Performance Tests:** Run weekly for monitoring
4. **Security Tests:** Run before deployment

### **Deployment Workflow**
1. **Build:** Create production Docker images
2. **Test:** Run full test suite
3. **Deploy:** Deploy to staging/production
4. **Monitor:** Track performance and errors

---

## 📋 File Naming Conventions

### **Backend Files**
- **Services:** `service_name_service.bal`
- **Models:** `model_name.bal`
- **Utils:** `utility_name.bal`
- **Tests:** `test_service_name_test.bal`

### **Frontend Files**
- **Components:** `ComponentName.tsx`
- **Pages:** `page.tsx` (Next.js App Router)
- **Hooks:** `useHookName.ts`
- **Utils:** `utilityName.ts`
- **Types:** `typeName.ts`

### **Database Collections**
- **Collections:** `collection_name` (snake_case)
- **Fields:** `fieldName` (camelCase)
- **Indexes:** `idx_collection_field` (snake_case)

---

## 🔒 Security Considerations

### **Authentication & Authorization**
- **JWT Tokens:** Secure session management
- **Password Hashing:** bcrypt with salt
- **Role-based Access:** Permission-based authorization
- **Session Timeout:** Automatic token expiration

### **Data Protection**
- **HTTPS Only:** All communications encrypted
- **Input Validation:** SQL injection and XSS protection
- **Rate Limiting:** API abuse prevention
- **Audit Logging:** Track all system access

---

## 📈 Performance Optimization

### **Backend Optimization**
- **Database Indexes:** Optimized query performance
- **Connection Pooling:** Efficient database connections
- **Caching:** Redis for frequently accessed data
- **Async Operations:** Non-blocking I/O operations

### **Frontend Optimization**
- **Code Splitting:** Lazy loading of components
- **Image Optimization:** WebP format and lazy loading
- **Bundle Analysis:** Webpack bundle optimization
- **Performance Monitoring:** Real-time performance metrics

---

## 🎯 Next Steps

### **Immediate Actions**
1. **Backend Setup:** Initialize Ballerina project structure
2. **Database Design:** Create MongoDB collections and indexes
3. **Core Services:** Implement basic CRUD operations
4. **Frontend Setup:** Initialize Next.js project

### **Short-term Goals**
1. **Authentication System:** JWT-based admin login
2. **Parcel Management:** Basic CRUD operations
3. **Status Tracking:** Update and query parcel status
4. **Admin Dashboard:** Basic management interface

### **Medium-term Goals**
1. **WhatsApp Integration:** Generate tracking links
2. **Public Tracking:** Customer-facing tracking pages
3. **Advanced Features:** Bulk operations and reporting
4. **Testing & Deployment:** Comprehensive testing and deployment

---

**This structure provides a solid foundation for building a scalable, maintainable courier service parcel tracking system.** 🚀 