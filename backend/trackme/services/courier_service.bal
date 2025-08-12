import ballerina/io;
import ballerinax/mongodb;
import ballerina/uuid;
import trackme.models.courier_service;

service class CourierServiceService {
    private mongodb:Client mongodbClient;
    private string databaseName = "TrackMeDB";
    private string collectionName = "courier_services";
    
    function init() returns error? {
        mongodb:ClientConfiguration config = {
            host: "cluster0.da9rgkc.mongodb.net",
            port: 27017,
            options: {
                auth: {
                    username: "chamod",
                    password: "1234"
                },
                authSource: "admin",
                authMechanism: "SCRAM-SHA-1",
                ssl: true,
                retryWrites: true,
                w: "majority"
            }
        };
        
        self.mongodbClient = check mongodb:Client(config);
        io:println("✅ MongoDB client initialized successfully");
    }
    
    // Register new courier service
    remote function registerCourierService(string name, string email, string phone, string address, string? logo, string[] serviceAreas) returns string|error {
        io:println("Registering courier service: " + name);
        
        // Generate ID
        string id = uuid:createV4();
        
        // Create courier service record
        CourierService courierService = {
            id: id,
            name: name,
            email: email,
            phone: phone,
            address: address,
            logo: logo,
            serviceAreas: serviceAreas
        };
        
        // Insert into MongoDB
        var result = self.mongodbClient->insert(self.databaseName, self.collectionName, courierService);
        if (result is error) {
            io:println("❌ Error inserting courier service: " + result.message());
            return error("Failed to register courier service: " + result.message());
        }
        
        io:println("✅ Courier service registered successfully with ID: " + id);
        return "Courier service registered successfully with ID: " + id;
    }
    
    // Get courier service by ID
    remote function getCourierService(string id) returns string|error {
        io:println("Getting courier service: " + id);
        
        // Query MongoDB
        var result = self.mongodbClient->query(self.databaseName, self.collectionName, 
            {id: id}, {});
        
        if (result is error) {
            io:println("❌ Error querying courier service: " + result.message());
            return error("Failed to retrieve courier service: " + result.message());
        }
        
        if (result.length() == 0) {
            return "Courier service not found";
        }
        
        var courierService = result[0];
        io:println("✅ Courier service retrieved successfully");
        return "Found courier service: " + courierService.name;
    }
    
    // Get all courier services
    remote function getAllCourierServices() returns string|error {
        io:println("Getting all courier services...");
        
        // Query MongoDB
        var result = self.mongodbClient->query(self.databaseName, self.collectionName, 
            {}, {});
        
        if (result is error) {
            io:println("❌ Error querying courier services: " + result.message());
            return error("Failed to retrieve courier services: " + result.message());
        }
        
        io:println("✅ Retrieved " + result.length().toString() + " courier services");
        return "Found " + result.length().toString() + " courier services";
    }
}
