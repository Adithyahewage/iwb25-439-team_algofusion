# TrackMe Backend

Ballerina backend service for the TrackMe parcel tracking system.

## 🚀 Features

- **Courier Service Management**: Register and manage courier services
- **User Management**: Create and manage staff accounts with role-based permissions
- **RESTful APIs**: Clean, documented API endpoints
- **MongoDB Integration**: Flexible document storage with optimized indexes
- **Input Validation**: Comprehensive validation and sanitization
- **Error Handling**: Standardized error responses and logging

## 📋 Prerequisites

- [Ballerina](https://ballerina.io/download/) 2201.8.0+
- [MongoDB](https://www.mongodb.com/) 7.0+
- [Java](https://adoptium.net/) 17+

## 🛠️ Setup

### 1. Install Dependencies

```bash
# Install Ballerina dependencies
bal build
```

### 2. Configure Environment

Copy the environment configuration:

```bash
cp config.env .env
# Edit .env with your MongoDB settings
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -p 27017:27017 \
  mongo:7.0

# Or start your local MongoDB instance
```

### 4. Run the Service

```bash
# Development mode
bal run

# Build and run
bal build
bal run target/bin/trackme.jar
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Service health status

### Root
- `GET /` - API information and available endpoints

### Courier Services
- `POST /api/v1/courier-services` - Register new courier service
- `GET /api/v1/courier-services` - List all courier services
- `GET /api/v1/courier-services/{id}` - Get courier service details
- `PUT /api/v1/courier-services/{id}` - Update courier service
- `DELETE /api/v1/courier-services/{id}` - Delete courier service
- `GET /api/v1/courier-services/search` - Search courier services

### User Management
- `POST /api/v1/courier-services/{id}/users` - Add user to courier service
- `GET /api/v1/courier-services/{id}/users` - Get users for courier service
- `PUT /api/v1/courier-services/{id}/users/{userId}` - Update user
- `DELETE /api/v1/courier-services/{id}/users/{userId}` - Remove user

## 🗄️ Database Schema

### Courier Services Collection
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "logo": "string",
  "serviceAreas": ["string"],
  "users": [
    {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string",
      "permissions": ["string"],
      "createdAt": "Date",
      "lastLogin": "Date"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 🔧 Development

### Project Structure
```
src/
├── main.bal                 # Main application entry point
├── models/                  # Data models and types
│   ├── courier_service.bal  # Courier service data types
│   └── user.bal            # User data types
├── services/                # HTTP service implementations
│   └── courier_service.bal # Courier service management
└── utils/                   # Utility functions
    ├── response.bal         # HTTP response utilities
    ├── validation.bal       # Input validation
    └── database.bal         # Database utilities
```

### Running Tests
```bash
# Run all tests
bal test

# Run specific test file
bal test --tests test_courier_service_test.bal

# Run with coverage
bal test --code-coverage
```

### Code Quality
```bash
# Format code
bal format

# Check code quality
bal check
```

## 🐳 Docker

### Build Docker Image
```bash
docker build -t trackme-backend .
```

### Run with Docker Compose
```bash
docker-compose up backend
```

## 📊 Monitoring

### Health Check
- Endpoint: `GET /health`
- Returns: Service status, database connectivity, timestamp

### Database Statistics
- Function: `database:getDatabaseStats()`
- Returns: Database size, collections, indexes

### Connection Pool Status
- Function: `database:getConnectionPoolStatus()`
- Returns: Active connections, pool metrics

## 🔒 Security

- Input validation and sanitization
- Role-based access control
- Secure database connections
- Environment variable configuration

## 🚧 TODO

- [ ] Authentication service implementation
- [ ] Parcel management service
- [ ] Public tracking service
- [ ] WhatsApp integration service
- [ ] Rate limiting and throttling
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Comprehensive testing suite
- [ ] Performance monitoring
- [ ] Logging and audit trails

## 📞 Support

For issues and questions:
1. Check the logs for error details
2. Verify MongoDB connection and permissions
3. Ensure all environment variables are set
4. Check Ballerina version compatibility

## 📝 License

This project is part of TrackMe and follows the same license terms. 