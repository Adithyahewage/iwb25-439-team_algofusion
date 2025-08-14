import ballerinax/mongodb;
import ballerina/log;

// MongoDB client configuration
public configurable string mongoDbUrl = "mongodb+srv://chamod:1234@cluster0.da9rgkc.mongodb.net/TrackMeDB?retryWrites=true&w=majority&appName=Cluster0";
public configurable string dbName = "TrackMe";

// MongoDB client
public mongodb:Client dbClient = initMongoDbClient();

// Database instance
public mongodb:Database db = initMongoDbDatabase();
public type Update mongodb:Update;
public type UpdateResult mongodb:UpdateResult;
public type Database mongodb:Database;
public type Collection mongodb:Collection;
public type FindOptions mongodb:FindOptions;

// Collection references - initialized through functions to avoid the check keyword at module level
public mongodb:Collection userCollection = getCollectionRef("courier_service");

// Initialize MongoDB client - handles the error internally
function initMongoDbClient() returns mongodb:Client {
    mongodb:Client|error dbclient = new ({
        connection: mongoDbUrl
    });
    
    if dbclient is error {
        panic error("Failed to initialize MongoDB client: " + dbclient.message());
    }
    
    log:printInfo("MongoDB client initialized successfully");
    return dbclient;
}

// Initialize MongoDB database - handles the error internally
function initMongoDbDatabase() returns mongodb:Database {
    mongodb:Database|error database = dbClient->getDatabase(dbName);
    
    if database is error {
        panic error("Failed to get MongoDB database: " + database.message());
    }
    
    log:printInfo("MongoDB database initialized successfully");
    return database;
}

// Get collection reference - handles the error internally
function getCollectionRef(string collectionName) returns mongodb:Collection {
    mongodb:Collection|error collection = db->getCollection(collectionName);
    
    if collection is error {
        panic error("Failed to get collection '" + collectionName + "': " + collection.message());
    }
    
    return collection;
}

// Function to close connection - using the correct arrow syntax for remote method calls
public function closeConnection() {
    var result = dbClient->close();
    if result is error {
        log:printError("Error closing MongoDB connection", result);
    } else {
        log:printInfo("MongoDB connection closed successfully");
    }
}

// Public function to get a collection by name
public function getCollection(string collectionName) returns mongodb:Collection|error {
    return db->getCollection(collectionName);
}