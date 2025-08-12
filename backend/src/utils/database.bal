// Database Utility Functions

import ballerina/mongodb;
import ballerina/io;
import ballerina/env;

// Database configuration
public type DatabaseConfig record {
    string uri;
    string database;
    string username;
    string password;
    int maxPoolSize;
    int minPoolSize;
    int maxIdleTime;
};

// MongoDB client instance
private mongodb:Client? mongoClient = ();

// Get MongoDB client (singleton pattern)
public function getMongoClient() returns mongodb:Client|error {
    if (mongoClient is mongodb:Client) {
        return mongoClient;
    }
    
    // Get configuration
    DatabaseConfig config = getDatabaseConfig();
    
    // Create new client
    mongodb:Client client = new mongodb:Client(config.uri, {
        username: config.username,
        password: config.password,
        database: config.database,
        options: {
            maxPoolSize: config.maxPoolSize,
            minPoolSize: config.minPoolSize,
            maxIdleTime: config.maxIdleTime
        }
    });
    
    // Test connection
    var result = client->ping();
    if (result is error) {
        io:println("Error connecting to MongoDB: ", result);
        return result;
    }
    
    io:println("Successfully connected to MongoDB");
    mongoClient = client;
    return client;
}

// Get database configuration from environment variables
public function getDatabaseConfig() returns DatabaseConfig {
    return {
        uri: env:get("MONGODB_URI") ?: "mongodb://localhost:27017",
        database: env:get("MONGODB_DATABASE") ?: "trackme",
        username: env:get("MONGODB_USERNAME") ?: "admin",
        password: env:get("MONGODB_PASSWORD") ?: "password",
        maxPoolSize: <int>(env:get("MONGODB_MAX_POOL_SIZE") ?: "10"),
        minPoolSize: <int>(env:get("MONGODB_MIN_POOL_SIZE") ?: "1"),
        maxIdleTime: <int>(env:get("MONGODB_MAX_IDLE_TIME") ?: "30000")
    };
}

// Close database connection
public function closeDatabaseConnection() returns error? {
    if (mongoClient is mongodb:Client) {
        var result = mongoClient.close();
        mongoClient = ();
        return result;
    }
    return ();
}

// Health check for database
public function checkDatabaseHealth() returns boolean {
    if (mongoClient is mongodb:Client) {
        var result = mongoClient->ping();
        return result is ();
    }
    return false;
}

// Get database statistics
public function getDatabaseStats() returns record {}|error {
    if (mongoClient is mongodb:Client) {
        return mongoClient->runCommand({
            "dbStats": 1
        });
    }
    return error("Database client not initialized");
}

// Get collection statistics
public function getCollectionStats(string collectionName) returns record {}|error {
    if (mongoClient is mongodb:Client) {
        return mongoClient->runCommand({
            "collStats": collectionName
        });
    }
    return error("Database client not initialized");
}

// Create database indexes
public function createIndexes() returns error? {
    if (mongoClient is mongodb:Client) {
        // Create indexes for courier_services collection
        var courierServiceIndexes = [
            {
                "key": {"email": 1},
                "unique": true,
                "name": "idx_courier_services_email"
            },
            {
                "key": {"name": 1},
                "name": "idx_courier_services_name"
            },
            {
                "key": {"createdAt": -1},
                "name": "idx_courier_services_created_at"
            }
        ];
        
        foreach var index in courierServiceIndexes {
            var result = mongoClient->createIndex("courier_services", index);
            if (result is error) {
                io:println("Error creating index: ", result);
            }
        }
        
        // Create indexes for users collection (if separate)
        var userIndexes = [
            {
                "key": {"email": 1, "courierServiceId": 1},
                "unique": true,
                "name": "idx_users_email_courier_service"
            },
            {
                "key": {"courierServiceId": 1},
                "name": "idx_users_courier_service"
            }
        ];
        
        foreach var index in userIndexes {
            var result = mongoClient->createIndex("users", index);
            if (result is error) {
                io:println("Error creating user index: ", result);
            }
        }
        
        // Create indexes for parcels collection
        var parcelIndexes = [
            {
                "key": {"trackingNumber": 1},
                "unique": true,
                "name": "idx_parcels_tracking_number"
            },
            {
                "key": {"courierServiceId": 1},
                "name": "idx_parcels_courier_service"
            },
            {
                "key": {"status": 1},
                "name": "idx_parcels_status"
            },
            {
                "key": {"createdAt": -1},
                "name": "idx_parcels_created_at"
            }
        ];
        
        foreach var index in parcelIndexes {
            var result = mongoClient->createIndex("parcels", index);
            if (result is error) {
                io:println("Error creating parcel index: ", result);
            }
        }
    }
    return ();
}

// Initialize database with sample data (for development)
public function initializeSampleData() returns error? {
    if (mongoClient is mongodb:Client) {
        // Check if sample data already exists
        var existingServices = mongoClient->find("courier_services", {});
        if (existingServices is mongodb:Cursor) {
            if (existingServices.hasNext()) {
                io:println("Sample data already exists, skipping initialization");
                return ();
            }
        }
        
        // Create sample courier service
        var sampleService = {
            "_id": "sample-courier-001",
            "name": "Sample Courier Service",
            "email": "info@samplecourier.com",
            "phone": "+1234567890",
            "address": "123 Sample Street, Sample City, SC 12345",
            "logo": "https://example.com/logo.png",
            "serviceAreas": ["Sample City", "Sample County", "Sample State"],
            "users": [
                {
                    "id": "sample-user-001",
                    "email": "admin@samplecourier.com",
                    "name": "Sample Admin",
                    "role": "admin",
                    "permissions": ["read", "write", "delete", "manage_users", "manage_service"],
                    "createdAt": time:utcNow(),
                    "lastLogin": ()
                }
            ],
            "createdAt": time:utcNow(),
            "updatedAt": time:utcNow()
        };
        
        var result = mongoClient->insert("courier_services", sampleService);
        if (result is error) {
            io:println("Error inserting sample data: ", result);
            return result;
        }
        
        io:println("Sample data initialized successfully");
    }
    return ();
}

// Database connection pool status
public function getConnectionPoolStatus() returns record {}|error {
    if (mongoClient is mongodb:Client) {
        return mongoClient->runCommand({
            "serverStatus": 1
        });
    }
    return error("Database client not initialized");
} 