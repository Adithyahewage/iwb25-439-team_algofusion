# 📦 TrackMe - Cloud-Native Parcel Tracking System

A modern, location-aware parcel tracking system built with **Ballerina** backend and **Next.js** frontend, featuring real-time location tracking, interactive maps, and intelligent notifications.

## 🚀 Features

- **📍 Real-time Location Tracking** - GPS-based parcel monitoring
- **🗺️ Interactive Maps** - Visual journey tracking with route optimization
- **📱 Responsive Design** - Mobile-first web interface
- **🔔 Smart Notifications** - Email alerts with location-based updates
- **📊 Admin Dashboard** - Comprehensive parcel management
- **🌐 RESTful APIs** - Clean, documented API endpoints
- **🐳 Docker Ready** - Easy deployment with containerization

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Ballerina     │    │   MongoDB       │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • React UI      │    │ • REST APIs     │    │ • Document Store│
│ • Interactive   │    │ • Location      │    │ • Geospatial    │
│   Maps          │    │   Services      │    │   Queries       │
│ • Real-time     │    │ • Notifications │    │ • Indexing      │
│   Updates       │    │ • Validation    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Ballerina** - Cloud-native programming language
- **MongoDB** - Document database with geospatial support
- **Docker** - Containerization

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Mapbox** - Interactive maps and location services

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- **Node.js** 18+ and **npm**
- **Ballerina** 2201.8.0+
- **MongoDB** 7.0+ (local or Atlas)
- **Docker** and **Docker Compose** (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/trackme.git
cd trackme
```

### 2. Backend Setup
```bash
cd backend
bal build
bal run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Database Setup
```bash
# Using Docker
docker-compose up -d mongodb

# Or connect to MongoDB Atlas
# Update connection string in backend/config/mongodb.toml
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9090
- **API Documentation**: http://localhost:9090/docs

## 📁 Project Structure

```
TrackMe/
├── backend/                    # Ballerina Backend
│   ├── src/
│   │   ├── services/          # Business logic
│   │   ├── models/            # Data models
│   │   └── utils/             # Utilities
│   ├── tests/                 # Backend tests
│   └── Ballerina.toml         # Ballerina config
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   └── lib/               # Utilities
│   ├── public/                # Static assets
│   └── package.json
├── docker/                     # Docker configuration
├── docs/                       # Documentation
└── scripts/                    # Build/deploy scripts
```

## 🔧 Development

### Backend Development
```bash
cd backend
bal build          # Build the project
bal test           # Run tests
bal run            # Run in development
```

### Frontend Development
```bash
cd frontend
npm run dev        # Development server
npm run build      # Production build
npm run test       # Run tests
```

### Database Operations
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/trackit

# View collections
show collections

# Query parcels
db.parcels.find().pretty()
```

## 📚 API Documentation

### Core Endpoints

#### Create Parcel
```http
POST /api/parcels
Content-Type: application/json

{
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
    "description": "Electronics package"
  },
  "locations": {
    "pickup": {
      "coordinates": [-74.0060, 40.7128],
      "address": "123 Main St, NYC"
    },
    "delivery": {
      "coordinates": [-73.9851, 40.7589],
      "address": "456 Broadway, NYC"
    }
  }
}
```

#### Track Parcel
```http
GET /api/parcels/{id}
```

#### Update Location
```http
PUT /api/parcels/{id}/location
Content-Type: application/json

{
  "coordinates": [-73.9900, 40.7300],
  "status": "In Transit",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
bal test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### End-to-End Tests
```bash
npm run test:e2e
```

## 📊 Monitoring

- **Application Logs**: Check console output
- **Database**: MongoDB Compass or mongosh
- **API Health**: `GET /health`
- **Metrics**: Prometheus endpoints available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ballerina** team for the amazing cloud-native language
- **Next.js** team for the React framework
- **MongoDB** for the document database
- **Mapbox** for location services

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/trackme/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/trackme/wiki)
- **Email**: support@trackme.com

---

**Built with ❤️ using Ballerina and Next.js**