// TrackMe Backend Main Application

import ballerina/http;
import ballerina/io;
import ballerina/log;
import trackme.services.courier_service;
import trackme.utils.database;

// HTTP listener configuration
listener http:Listener httpListener = new http:Listener(8080);

// Main service that includes all sub-services
@http:ServiceConfig {
    basePath: "/"
}
service class TrackMeService {
    
    // Health check endpoint
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/health"
    }
    resource function get health(http:Caller caller, http:Request req) returns error? {
        var response = {
            "status": "healthy",
            "timestamp": time:utcNow(),
            "service": "TrackMe Backend",
            "version": "1.0.0",
            "database": database:checkDatabaseHealth()
        };
        
        _ = caller->respond(response);
    }
    
    // Root endpoint
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function get root(http:Caller caller, http:Request req) returns error? {
        var response = {
            "message": "Welcome to TrackMe Backend API",
            "version": "1.0.0",
            "endpoints": {
                "health": "/health",
                "courier_services": "/api/v1/courier-services",
                "parcels": "/api/v1/parcels",
                "tracking": "/api/v1/tracking",
                "auth": "/api/v1/auth"
            },
            "documentation": "/docs"
        };
        
        _ = caller->respond(response);
    }
}

// Initialize the application
public function main() returns error? {
    io:println("🚀 Starting TrackMe Backend Service...");
    
    // Initialize database connection
    var dbClient = database:getMongoClient();
    if (dbClient is error) {
        io:println("❌ Failed to connect to database: ", dbClient);
        return dbClient;
    }
    
    // Create database indexes
    var indexResult = database:createIndexes();
    if (indexResult is error) {
        io:println("⚠️ Warning: Failed to create some database indexes: ", indexResult);
    } else {
        io:println("✅ Database indexes created successfully");
    }
    
    // Initialize sample data for development
    var sampleDataResult = database:initializeSampleData();
    if (sampleDataResult is error) {
        io:println("⚠️ Warning: Failed to initialize sample data: ", sampleDataResult);
    } else {
        io:println("✅ Sample data initialized successfully");
    }
    
    // Start HTTP listener
    io:println("🌐 Starting HTTP listener on port 8080...");
    var listenerResult = httpListener.attach(TrackMeService);
    if (listenerResult is error) {
        io:println("❌ Failed to attach service to listener: ", listenerResult);
        return listenerResult;
    }
    
    // Start courier service
    var courierServiceResult = httpListener.attach(courier_service:CourierServiceService);
    if (courierServiceResult is error) {
        io:println("❌ Failed to attach courier service: ", courierServiceResult);
        return courierServiceResult;
    }
    
    io:println("✅ TrackMe Backend Service started successfully!");
    io:println("📡 API available at: http://localhost:8080");
    io:println("🔍 Health check: http://localhost:8080/health");
    
    // Keep the service running
    var listenerStatus = httpListener.start();
    if (listenerStatus is error) {
        io:println("❌ Failed to start HTTP listener: ", listenerStatus);
        return listenerStatus;
    }
    
    return ();
} 