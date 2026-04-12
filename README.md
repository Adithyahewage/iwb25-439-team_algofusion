# 📦 TrackMe - Courier Service Parcel Tracking System

[![Ballerina](https://img.shields.io/badge/Ballerina-2201.8.0+-D73A49?style=flat-square&logo=ballerina)](https://ballerina.io/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-20.10+-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

> **TrackMe** is a modern, cloud-native parcel tracking system designed specifically for courier services. It enables multiple courier companies to register, manage their parcels, update delivery status, and share tracking information with customers through WhatsApp links.

## 🎯 **What is TrackMe?**

TrackMe is a **courier service-focused** parcel tracking platform that provides:

- **🚚 Courier Service Registration:** Multiple courier services can create accounts and manage their operations
- **📦 Parcel Management:** Create, edit, and track parcel status updates efficiently
- **📱 WhatsApp Integration:** Generate tracking links that can be shared via WhatsApp
- **🌐 Customer Tracking Portal:** Simple interface for customers to track parcels without registration
- **⚙️ Admin Dashboard:** Comprehensive management interface for courier services
- **🔄 Real-time Updates:** Instant status updates and notifications

## 🚀 **Key Features**

### **For Courier Services (Admin)**
- **Multi-tenant Architecture:** Each courier service has isolated data and operations
- **Parcel CRUD Operations:** Create, read, update, and delete parcels
- **Status Management:** Easy interface to update delivery status
- **Bulk Operations:** Import multiple parcels from CSV/Excel files
- **User Management:** Multiple staff accounts with different permission levels
- **Analytics Dashboard:** Delivery performance metrics and insights

### **For Customers (Public)**
- **No Registration Required:** Track parcels using just the tracking number
- **Mobile Responsive:** Optimized for all device sizes
- **Status Timeline:** Visual representation of delivery progress
- **WhatsApp Sharing:** Easy sharing of tracking information
- **Real-time Updates:** Live status changes and notifications

## 🏗️ **Technical Architecture**

### **Backend (Ballerina)**
- **Language:** Ballerina 2201.8.0+
- **Framework:** HTTP services with MongoDB integration
- **Database:** MongoDB for flexible parcel and courier data storage
- **Authentication:** JWT-based secure authentication
- **Port:** 8080

### **Frontend (Next.js)**
- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS for modern, responsive design
- **Language:** TypeScript for type safety
- **State Management:** React Context and custom hooks
- **Port:** 3000

### **Database (MongoDB)**
- **Collections:** courier_services, parcels, users, status_updates
- **Indexes:** Optimized for tracking queries and status lookups
- **Features:** Flexible document storage for parcel data

## 📁 **Project Structure**

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

## 🚀 **Quick Start**

### **Prerequisites**
- [Ballerina](https://ballerina.io/download/) 2201.8.0+
- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) 20.10+
- [MongoDB](https://www.mongodb.com/) 7.0+

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/trackme.git
cd trackme
```

### **2. Start MongoDB**
```bash
docker-compose up mongodb -d
```

### **3. Start Backend**
```bash
cd backend
bal run
```

### **4. Start Frontend**
```bash
cd frontend/trackme
npm install
npm run dev
```

### **5. Access the Application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **MongoDB:** localhost:27017

## 📚 **Documentation**

- **[Project Specification](docs/PROJECT_SPECIFICATION.md)** - Detailed project requirements and architecture
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Complete project structure and development guide
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - High-level project overview and timeline
- **[Implementation Guide](docs/IMPLEMENTATION_GUIDE.md)** - Step-by-step development instructions

## 🔧 **Development**

### **Backend Development**
```bash
cd backend
bal test          # Run tests
bal build         # Build project
bal run           # Run in development mode
```

### **Frontend Development**
```bash
cd frontend/trackme
npm run dev       # Start development server
npm run build     # Build for production
npm run test      # Run tests
npm run lint      # Run linting
```

### **Database Management**
```bash
# Access MongoDB shell
docker exec -it trackme_mongodb mongosh -u admin -p password

# View collections
use trackme
show collections
```

## 🧪 **Testing**

### **Backend Testing**
- **Unit Tests:** Individual service and utility functions
- **Integration Tests:** API endpoints and database operations
- **Performance Tests:** Load testing for tracking queries

### **Frontend Testing**
- **Component Tests:** Individual React components
- **Integration Tests:** Page interactions and API calls
- **E2E Tests:** Complete user workflows

## 🐳 **Docker Deployment**

### **Development Environment**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### **Production Deployment**
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 **Security Features**

- **JWT Authentication:** Secure session management for admin users
- **Password Hashing:** bcrypt with salt for user passwords
- **Input Validation:** SQL injection and XSS protection
- **Rate Limiting:** API abuse prevention
- **HTTPS Only:** All communications encrypted
- **Role-based Access:** Permission-based authorization

## 📊 **Performance Targets**

- **API Response:** < 200ms for standard operations
- **Tracking Queries:** < 100ms for status lookups
- **Page Load:** < 2 seconds for initial page render
- **Concurrent Users:** Support 500+ simultaneous users
- **System Uptime:** 99.9% availability target



🎯 Ready to Build?

**TrackMe** is designed to revolutionize how courier services manage parcel tracking. With its modern architecture, WhatsApp integration, and customer-friendly interface, it provides a complete solution for the courier industry.

Ready to build the future of courier parcel tracking? 🚀

- **Start with the [Implementation Guide](docs/IMPLEMENTATION_GUIDE.md)**
- **Review the [Project Specification](docs/PROJECT_SPECIFICATION.md)**
- **Check the [Project Structure](docs/PROJECT_STRUCTURE.md)**

---

**Made with ❤️ by the TrackMe Team**

*Let's make courier parcel tracking simple, transparent, and delightful! 📦✨*
