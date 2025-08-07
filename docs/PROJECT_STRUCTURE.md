# 📁 TrackMe Project Structure & Development Guide

## 🏗️ Repository Architecture

```
TrackMe/
├── .github/                      # GitHub Configuration
│   ├── workflows/               # CI/CD Pipelines
│   │   ├── backend-tests.yml    # Ballerina backend testing
│   │   ├── frontend-tests.yml   # Next.js frontend testing
│   │   └── deploy.yml           # Deployment automation
│   └── ISSUE_TEMPLATE/          # Issue templates
│       ├── bug_report.md
│       └── feature_request.md
├── backend/                      # Ballerina Backend
│   ├── Ballerina.toml           # Ballerina project config
│   ├── src/
│   │   ├── services/            # Business logic services
│   │   │   ├── parcel_service.bal
│   │   │   ├── location_service.bal
│   │   │   └── notification_service.bal
│   │   ├── models/              # Data models
│   │   │   ├── parcel.bal
│   │   │   └── geospatial.bal
│   │   └── utils/               # Utility functions
│   │       ├── mongo_client.bal
│   │       └── geo_utils.bal
│   ├── tests/                   # Backend tests
│   └── Dockerfile               # Backend container
├── frontend/                     # Next.js Frontend
│   ├── package.json
│   ├── next.config.js
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── track/
│   │   │   │   └── [id]/page.tsx # Tracking page
│   │   │   ├── admin/
│   │   │   │   └── page.tsx     # Admin dashboard
│   │   │   └── layout.tsx
│   │   ├── components/          # React components
│   │   │   ├── ParcelForm.tsx
│   │   │   ├── TrackingDisplay.tsx
│   │   │   ├── LocationMap.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── lib/                 # Utilities
│   │   │   ├── api.ts
│   │   │   ├── types.ts
│   │   │   └── mapUtils.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/                  # Static assets
│   └── Dockerfile               # Frontend container
├── docker/                       # Docker Configuration
│   ├── docker-compose.yml       # Multi-service orchestration
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docs/                         # Documentation
│   ├── API.md                   # API documentation
│   ├── SETUP.md                 # Setup instructions
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── PROJECT_STRUCTURE.md     # This file
├── scripts/                      # Development Scripts
│   ├── setup.sh                 # Environment setup
│   ├── start.sh                 # Start all services
│   ├── stop.sh                  # Stop all services
│   └── init-mongo.js            # MongoDB initialization
├── .gitignore                   # Git ignore rules
├── README.md                    # Project overview
└── LICENSE                      # Project license
```

## 🔄 Development Workflow

### 1. **Initial Setup**
```bash
# Clone repository
git clone https://github.com/yourusername/trackme.git
cd trackme

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. **Daily Development**
```bash
# Start all services
./scripts/start.sh

# Or start individually
cd backend && bal run
cd frontend && npm run dev
```

### 3. **Feature Development**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test changes
# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### 4. **Testing**
```bash
# Backend tests
cd backend && bal test

# Frontend tests
cd frontend && npm test

# End-to-end tests
npm run test:e2e
```

## 📋 Branch Strategy

### **Main Branches**
- `main` - Production-ready code
- `develop` - Integration branch for features

### **Feature Branches**
- `feature/parcel-tracking` - New tracking features
- `feature/location-maps` - Map integration
- `feature/notifications` - Notification system
- `feature/admin-dashboard` - Admin interface

### **Release Branches**
- `release/v1.0.0` - Release preparation
- `hotfix/critical-bug` - Critical bug fixes

## 🚀 CI/CD Pipeline

### **Backend Pipeline** (`.github/workflows/backend-tests.yml`)
1. **Trigger**: Push to `main`/`develop` or PR
2. **Setup**: Install Ballerina 2201.8.0
3. **Test**: Run `bal test`
4. **Build**: Create executable
5. **Artifact**: Upload build artifacts

### **Frontend Pipeline** (`.github/workflows/frontend-tests.yml`)
1. **Trigger**: Push to `main`/`develop` or PR
2. **Setup**: Install Node.js 18
3. **Lint**: Run ESLint
4. **Test**: Run Jest tests
5. **Build**: Create production build
6. **Artifact**: Upload build artifacts

### **Deployment Pipeline** (`.github/workflows/deploy.yml`)
1. **Trigger**: Push to `main`
2. **Build**: Create Docker images
3. **Push**: Upload to Docker Hub
4. **Deploy**: Deploy to production server

## 🗄️ Database Schema

### **Collections**

#### **parcels**
```javascript
{
  "_id": "TRK001",
  "sender": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "recipient": {
    "name": "Jane Smith",
    "phone": "+0987654321",
    "email": "jane@example.com"
  },
  "item": {
    "description": "Electronics package",
    "weight": 2.5,
    "dimensions": "30x20x15 cm"
  },
  "locations": {
    "pickup": {
      "type": "Point",
      "coordinates": [-74.0060, 40.7128],
      "address": "123 Main St, NYC"
    },
    "delivery": {
      "type": "Point",
      "coordinates": [-73.9851, 40.7589],
      "address": "456 Broadway, NYC"
    }
  },
  "status": "In Transit",
  "statusHistory": [...],
  "locationHistory": [...],
  "delivery": {
    "expectedDate": "2024-01-16",
    "actualDate": null,
    "eta": "2 hours",
    "distance": 5.2,
    "route": {...}
  },
  "notifications": {
    "emailSent": false,
    "smsSent": false,
    "lastNotification": null
  },
  "metadata": {
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
    "createdBy": "admin",
    "tags": ["electronics", "fragile"]
  }
}
```

#### **users**
```javascript
{
  "_id": "user001",
  "name": "Admin User",
  "email": "admin@trackit.com",
  "phone": "+1111111111",
  "role": "admin",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### **notifications**
```javascript
{
  "_id": "notif001",
  "parcelId": "TRK001",
  "recipientEmail": "jane@example.com",
  "type": "delivery",
  "status": "sent",
  "content": "Your parcel has been delivered",
  "createdAt": "2024-01-15T11:00:00Z"
}
```

### **Indexes**
- **Geospatial**: `locations.pickup`, `locations.delivery`, `locationHistory.coordinates`
- **Regular**: `status`, `recipient.email`, `metadata.createdAt`
- **Compound**: `status + createdAt`, `email + status`
- **Text**: `sender.name`, `recipient.name`, `item.description`

## 🔧 Environment Configuration

### **Backend Environment**
```toml
# backend/config/mongodb.toml
MONGODB_URI = "mongodb://admin:password@localhost:27017/trackit?authSource=admin"
LOG_LEVEL = "INFO"
EMAIL_SMTP_HOST = "smtp.gmail.com"
EMAIL_SMTP_PORT = 587
EMAIL_USERNAME = "your-email@gmail.com"
EMAIL_PASSWORD = "your-app-password"
```

### **Frontend Environment**
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:9090
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_APP_NAME=TrackIt
```

## 🐳 Docker Configuration

### **Services**
- **mongodb**: MongoDB 7.0 with authentication
- **backend**: Ballerina application
- **frontend**: Next.js application
- **mongo-express**: Database management UI

### **Networks**
- **trackit-network**: Internal communication

### **Volumes**
- **mongodb_data**: Persistent database storage

## 📊 Monitoring & Logging

### **Application Logs**
- **Backend**: Console output + file logs
- **Frontend**: Browser console + error tracking
- **Database**: MongoDB logs

### **Health Checks**
- **Backend**: `GET /health`
- **Frontend**: Built-in Next.js health
- **Database**: MongoDB connection status

### **Metrics**
- **API Response Times**
- **Database Query Performance**
- **Error Rates**
- **User Activity**

## 🧪 Testing Strategy

### **Backend Testing**
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: MongoDB operations testing

### **Frontend Testing**
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: Page testing with Playwright
- **E2E Tests**: Full user journey testing

### **API Testing**
- **Postman Collections**: API endpoint testing
- **Automated Tests**: CI/CD pipeline testing

## 📚 Documentation Standards

### **Code Documentation**
- **Ballerina**: Inline documentation with `@param` and `@return`
- **TypeScript**: JSDoc comments
- **API**: OpenAPI/Swagger specifications

### **Project Documentation**
- **README.md**: Project overview and quick start
- **API.md**: Detailed API documentation
- **SETUP.md**: Development environment setup
- **DEPLOYMENT.md**: Production deployment guide

## 🔒 Security Considerations

### **Authentication**
- JWT tokens for API access
- Role-based access control
- Session management

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

### **Environment Security**
- Environment variable management
- Secret management
- HTTPS enforcement
- Database access control

## 🚀 Performance Optimization

### **Backend Optimization**
- Database query optimization
- Connection pooling
- Caching strategies
- Async processing

### **Frontend Optimization**
- Code splitting
- Image optimization
- Bundle size reduction
- CDN usage

### **Database Optimization**
- Index optimization
- Query performance monitoring
- Connection pooling
- Data archiving

## 📈 Scalability Planning

### **Horizontal Scaling**
- Load balancer configuration
- Multiple backend instances
- Database replication
- CDN implementation

### **Vertical Scaling**
- Resource monitoring
- Performance profiling
- Bottleneck identification
- Resource allocation

---

**This documentation should be updated as the project evolves.** 