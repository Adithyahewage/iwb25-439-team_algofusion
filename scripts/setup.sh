#!/bin/bash

# TrackMe Development Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up TrackMe development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check Ballerina
    if ! command -v bal &> /dev/null; then
        print_error "Ballerina is not installed. Please install Ballerina 2201.8.0+"
        exit 1
    fi
    
    # Check Docker (optional)
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. You'll need to set up MongoDB manually"
    fi
    
    print_success "System requirements check completed"
}

# Setup backend
setup_backend() {
    print_status "Setting up Ballerina backend..."
    
    cd backend
    
    # Install Ballerina dependencies
    print_status "Installing Ballerina dependencies..."
    bal build
    
    # Create data directory
    mkdir -p data
    
    print_success "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up Next.js frontend..."
    
    cd frontend
    
    # Install npm dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    # Create environment file if it doesn't exist
    if [ ! -f .env.local ]; then
        print_status "Creating environment file..."
        cat > .env.local << EOF
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:9090
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
EOF
        print_warning "Please update .env.local with your Mapbox token"
    fi
    
    print_success "Frontend setup completed"
    cd ..
}

# Setup MongoDB
setup_mongodb() {
    print_status "Setting up MongoDB..."
    
    if command -v docker &> /dev/null; then
        print_status "Starting MongoDB with Docker..."
        docker-compose up -d mongodb
        
        # Wait for MongoDB to be ready
        print_status "Waiting for MongoDB to be ready..."
        sleep 10
        
        # Create database and collections
        print_status "Setting up database schema..."
        docker exec trackme-mongodb-1 mongosh --eval "
            use trackme;
            db.createCollection('parcels');
            db.parcels.createIndex({ 'locations.pickup': '2dsphere' });
            db.parcels.createIndex({ 'locations.delivery': '2dsphere' });
            db.parcels.createIndex({ 'status': 1 });
            db.parcels.createIndex({ 'metadata.createdAt': -1 });
            print('Database setup completed');
        "
        
        print_success "MongoDB setup completed"
    else
        print_warning "Docker not available. Please set up MongoDB manually:"
        echo "1. Install MongoDB 7.0+"
        echo "2. Start MongoDB service"
        echo "3. Create database 'trackit'"
        echo "4. Create collection 'parcels'"
        echo "5. Create geospatial indexes"
    fi
}

# Create development scripts
create_scripts() {
    print_status "Creating development scripts..."
    
    # Create start script
    cat > scripts/start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting TrackIt development environment..."

# Start MongoDB (if using Docker)
if command -v docker &> /dev/null; then
    echo "Starting MongoDB..."
    docker-compose up -d mongodb
fi

# Start backend
echo "Starting Ballerina backend..."
cd backend
bal run &
BACKEND_PID=$!

# Start frontend
echo "Starting Next.js frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

    echo "✅ TrackMe is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:9090"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF

    # Create stop script
    cat > scripts/stop.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping TrackMe services..."

# Stop backend
pkill -f "bal run" || true

# Stop frontend
pkill -f "npm run dev" || true

# Stop MongoDB
docker-compose down || true

echo "✅ All services stopped"
EOF

    # Make scripts executable
    chmod +x scripts/start.sh
    chmod +x scripts/stop.sh
    
    print_success "Development scripts created"
}

# Main setup function
main() {
    echo "📦 TrackMe Development Setup"
    echo "============================"
    
    check_requirements
    setup_backend
    setup_frontend
    setup_mongodb
    create_scripts
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update frontend/.env.local with your Mapbox token"
    echo "2. Run './scripts/start.sh' to start development servers"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "Useful commands:"
    echo "  ./scripts/start.sh  - Start all services"
    echo "  ./scripts/stop.sh   - Stop all services"
    echo "  cd backend && bal run  - Run backend only"
    echo "  cd frontend && npm run dev  - Run frontend only"
}

# Run main function
main "$@" 