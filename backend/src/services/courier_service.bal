import ballerina/http;
import ballerina/mongodb;
import ballerina/uuid;
import ballerina/time;
import ballerina/io;
import ballerina/stringutils;

// Import models
import trackme.models.courier_service;
import trackme.models.user;
import trackme.utils.response;
import trackme.utils.validation;
import trackme.utils.database;

@http:ServiceConfig {
    basePath: "/api/v1/courier-services"
}
service class CourierServiceService {
    private final mongodb:Client mongoClient;
    private final string collectionName = "courier_services";
    
    public function init() returns error? {
        self.mongoClient = database:getMongoClient();
    }
    
    // Register new courier service
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/"
    }
    remote function registerCourierService(http:Request req) returns http:Response|http:BadRequest|http:InternalServerError {
        // Parse request body
        var requestBody = req.getJsonPayload();
        if (requestBody is error) {
            return response:createBadRequest("Invalid JSON payload");
        }
        
        // Validate required fields
        if (!validation:validateCourierServiceRegistration(requestBody)) {
            return response:createBadRequest("Missing required fields: name, email, phone, address");
        }
        
        // Check if email already exists
        var existingService = self.mongoClient->findOne(self.collectionName, {
            "email": requestBody.email
        });
        
        if (existingService is mongodb:Document) {
            return response:createBadRequest("Courier service with this email already exists");
        }
        
        // Generate unique ID
        string serviceId = uuid:createType4AsString();
        
        // Create courier service document
        var courierService = {
            "_id": serviceId,
            "name": requestBody.name,
            "email": requestBody.email,
            "phone": requestBody.phone,
            "address": requestBody.address,
            "logo": requestBody.logo ?: "",
            "serviceAreas": requestBody.serviceAreas ?: [],
            "users": [],
            "createdAt": time:utcNow(),
            "updatedAt": time:utcNow()
        };
        
        // Insert into database
        var result = self.mongoClient->insert(self.collectionName, courierService);
        if (result is error) {
            io:println("Error inserting courier service: ", result);
            return response:createInternalServerError("Failed to create courier service");
        }
        
        // Create default admin user
        var adminUser = self.createDefaultAdminUser(serviceId, requestBody.email);
        if (adminUser is error) {
            io:println("Error creating admin user: ", adminUser);
            // Continue anyway, admin user can be created later
        }
        
        // Return success response
        return response:createSuccessResponse({
            "message": "Courier service registered successfully",
            "serviceId": serviceId,
            "adminCredentials": adminUser is error ? "Failed to create admin user" : adminUser
        });
    }
    
    // Get courier service by ID
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/{id}"
    }
    remote function getCourierService(string id) returns http:Response|http:NotFound|http:InternalServerError {
        // Validate ID format
        if (stringutils:isEmpty(id)) {
            return response:createBadRequest("Service ID is required");
        }
        
        // Find courier service
        var result = self.mongoClient->findOne(self.collectionName, {
            "_id": id
        });
        
        if (result is error) {
            io:println("Error finding courier service: ", result);
            return response:createInternalServerError("Database error");
        }
        
        if (result is ()) {
            return response:createNotFound("Courier service not found");
        }
        
        // Return courier service data
        return response:createSuccessResponse(result);
    }
    
    // Get all courier services (for admin purposes)
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    remote function getAllCourierServices(http:Request req) returns http:Response|http:InternalServerError {
        // Parse query parameters
        var limit = req.getQuery("limit");
        var offset = req.getQuery("offset");
        
        int limitValue = 10; // Default limit
        int offsetValue = 0; // Default offset
        
        if (limit is string) {
            limitValue = <int>limit;
        }
        if (offset is string) {
            offsetValue = <int>offset;
        }
        
        // Find courier services with pagination
        var result = self.mongoClient->find(self.collectionName, {}, {
            "limit": limitValue,
            "skip": offsetValue,
            "sort": {"createdAt": -1}
        });
        
        if (result is error) {
            io:println("Error finding courier services: ", result);
            return response:createInternalServerError("Database error");
        }
        
        // Convert cursor to array
        var services = [];
        while (result.hasNext()) {
            var service = result.next();
            if (service is mongodb:Document) {
                services.push(service);
            }
        }
        
        // Return services with pagination info
        return response:createSuccessResponse({
            "services": services,
            "pagination": {
                "limit": limitValue,
                "offset": offsetValue,
                "total": services.length()
            }
        });
    }
    
    // Update courier service
    @http:ResourceConfig {
        methods: ["PUT"],
        path: "/{id}"
    }
    remote function updateCourierService(string id, http:Request req) returns http:Response|http:BadRequest|http:NotFound|http:InternalServerError {
        // Validate ID format
        if (stringutils:isEmpty(id)) {
            return response:createBadRequest("Service ID is required");
        }
        
        // Parse request body
        var requestBody = req.getJsonPayload();
        if (requestBody is error) {
            return response:createBadRequest("Invalid JSON payload");
        }
        
        // Check if courier service exists
        var existingService = self.mongoClient->findOne(self.collectionName, {
            "_id": id
        });
        
        if (existingService is ()) {
            return response:createNotFound("Courier service not found");
        }
        
        // Prepare update data
        var updateData = {
            "updatedAt": time:utcNow()
        };
        
        // Add fields that are present in request
        if (requestBody.name is string) {
            updateData.name = requestBody.name;
        }
        if (requestBody.phone is string) {
            updateData.phone = requestBody.phone;
        }
        if (requestBody.address is string) {
            updateData.address = requestBody.address;
        }
        if (requestBody.logo is string) {
            updateData.logo = requestBody.logo;
        }
        if (requestBody.serviceAreas is string[]) {
            updateData.serviceAreas = requestBody.serviceAreas;
        }
        
        // Update in database
        var result = self.mongoClient->updateOne(self.collectionName, {
            "_id": id
        }, {
            "$set": updateData
        });
        
        if (result is error) {
            io:println("Error updating courier service: ", result);
            return response:createInternalServerError("Failed to update courier service");
        }
        
        // Return success response
        return response:createSuccessResponse({
            "message": "Courier service updated successfully",
            "serviceId": id
        });
    }
    
    // Delete courier service
    @http:ResourceConfig {
        methods: ["DELETE"],
        path: "/{id}"
    }
    remote function deleteCourierService(string id) returns http:Response|http:BadRequest|http:NotFound|http:InternalServerError {
        // Validate ID format
        if (stringutils:isEmpty(id)) {
            return response:createBadRequest("Service ID is required");
        }
        
        // Check if courier service exists
        var existingService = self.mongoClient->findOne(self.collectionName, {
            "_id": id
        });
        
        if (existingService is ()) {
            return response:createNotFound("Courier service not found");
        }
        
        // Delete courier service
        var result = self.mongoClient->deleteOne(self.collectionName, {
            "_id": id
        });
        
        if (result is error) {
            io:println("Error deleting courier service: ", result);
            return response:createInternalServerError("Failed to delete courier service");
        }
        
        // TODO: Also delete associated users and parcels
        // This would require additional database operations
        
        // Return success response
        return response:createSuccessResponse({
            "message": "Courier service deleted successfully",
            "serviceId": id
        });
    }
    
    // Add user to courier service
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/{id}/users"
    }
    remote function addUser(string id, http:Request req) returns http:Response|http:BadRequest|http:NotFound|http:InternalServerError {
        // Validate ID format
        if (stringutils:isEmpty(id)) {
            return response:createBadRequest("Service ID is required");
        }
        
        // Parse request body
        var requestBody = req.getJsonPayload();
        if (requestBody is error) {
            return response:createBadRequest("Invalid JSON payload");
        }
        
        // Validate required fields
        if (!validation:validateUserCreation(requestBody)) {
            return response:createBadRequest("Missing required fields: email, name, role");
        }
        
        // Check if courier service exists
        var existingService = self.mongoClient->findOne(self.collectionName, {
            "_id": id
        });
        
        if (existingService is ()) {
            return response:createNotFound("Courier service not found");
        }
        
        // Check if user email already exists in this service
        var existingUser = self.mongoClient->findOne(self.collectionName, {
            "_id": id,
            "users.email": requestBody.email
        });
        
        if (existingUser is mongodb:Document) {
            return response:createBadRequest("User with this email already exists in this service");
        }
        
        // Create new user
        var newUser = {
            "id": uuid:createType4AsString(),
            "email": requestBody.email,
            "name": requestBody.name,
            "role": requestBody.role,
            "permissions": requestBody.permissions ?: self.getDefaultPermissions(requestBody.role),
            "createdAt": time:utcNow(),
            "lastLogin": ()
        };
        
        // Add user to courier service
        var result = self.mongoClient->updateOne(self.collectionName, {
            "_id": id
        }, {
            "$push": {"users": newUser}
        });
        
        if (result is error) {
            io:println("Error adding user: ", result);
            return response:createInternalServerError("Failed to add user");
        }
        
        // Return success response
        return response:createSuccessResponse({
            "message": "User added successfully",
            "userId": newUser.id,
            "user": newUser
        });
    }
    
    // Get users for a courier service
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/{id}/users"
    }
    remote function getUsers(string id) returns http:Response|http:BadRequest|http:NotFound|http:InternalServerError {
        // Validate ID format
        if (stringutils:isEmpty(id)) {
            return response:createBadRequest("Service ID is required");
        }
        
        // Find courier service and extract users
        var result = self.mongoClient->findOne(self.collectionName, {
            "_id": id
        }, {
            "projection": {"users": 1}
        });
        
        if (result is error) {
            io:println("Error finding courier service users: ", result);
            return response:createInternalServerError("Database error");
        }
        
        if (result is ()) {
            return response:createNotFound("Courier service not found");
        }
        
        // Return users
        return response:createSuccessResponse({
            "users": result.users ?: []
        });
    }
    
    // Update user in courier service
    @http:ResourceConfig {
        methods: ["PUT"],
        path: "/{id}/users/{userId}"
    }
    remote function updateUser(string id, string userId, http:Request req) returns http:Response|http:BadRequest|http:NotFound|http:InternalServerError {
        // Validate parameters
        if (stringutils:isEmpty(id) || stringutils:isEmpty(userId)) {
            return response:createBadRequest("Service ID and User ID are required");
        }
        
        // Parse request body
        var requestBody = req.getJsonPayload();
        if (requestBody is error) {
            return response:createBadRequest("Invalid JSON payload");
        }
        
        // Prepare update data
        var updateData = {};
        if (requestBody.name is string) {
            updateData["users.$.name"] = requestBody.name;
        }
        if (requestBody.role is string) {
            updateData["users.$.permissions"] = self.getDefaultPermissions(requestBody.role);
        }
        if (requestBody.permissions is string[]) {
            updateData["users.$.permissions"] = requestBody.permissions;
        }
        
        // Update user in database
        var result = self.mongoClient->updateOne(self.collectionName, {
            "_id": id,
            "users.id": userId
        }, {
            "$set": updateData
        });
        
        if (result is error) {
            io:println("Error updating user: ", result);
            return response:createInternalServerError("Failed to update user");
        }
        
        if (result.matchedCount == 0) {
            return response:createNotFound("User not found");
        }
        
        // Return success response
        return response:createSuccessResponse({
            "message": "User updated successfully",
            "userId": userId
        });
    }
    
    // Remove user from courier service
    @http:ResourceConfig {
        methods: ["DELETE"],
        path: "/{id}/users/{userId}"
    }
    remote function removeUser(string id, string userId) returns http:Response|http:BadRequest|http:NotFound|http:InternalServerError {
        // Validate parameters
        if (stringutils:isEmpty(id) || stringutils:isEmpty(userId)) {
            return response:createBadRequest("Service ID and User ID are required");
        }
        
        // Remove user from courier service
        var result = self.mongoClient->updateOne(self.collectionName, {
            "_id": id
        }, {
            "$pull": {"users": {"id": userId}}
        });
        
        if (result is error) {
            io:println("Error removing user: ", result);
            return response:createInternalServerError("Failed to remove user");
        }
        
        if (result.matchedCount == 0) {
            return response:createNotFound("Courier service not found");
        }
        
        // Return success response
        return response:createSuccessResponse({
            "message": "User removed successfully",
            "userId": userId
        });
    }
    
    // Search courier services
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/search"
    }
    remote function searchCourierServices(http:Request req) returns http:Response|http:InternalServerError {
        // Parse query parameters
        var name = req.getQuery("name");
        var email = req.getQuery("email");
        var serviceArea = req.getQuery("serviceArea");
        
        // Build search query
        var searchQuery = {};
        if (name is string) {
            searchQuery["name"] = {"$regex": name, "$options": "i"};
        }
        if (email is string) {
            searchQuery["email"] = {"$regex": email, "$options": "i"};
        }
        if (serviceArea is string) {
            searchQuery["serviceAreas"] = {"$in": [serviceArea]};
        }
        
        // Execute search
        var result = self.mongoClient->find(self.collectionName, searchQuery, {
            "limit": 20,
            "sort": {"name": 1}
        });
        
        if (result is error) {
            io:println("Error searching courier services: ", result);
            return response:createInternalServerError("Database error");
        }
        
        // Convert cursor to array
        var services = [];
        while (result.hasNext()) {
            var service = result.next();
            if (service is mongodb:Document) {
                services.push(service);
            }
        }
        
        // Return search results
        return response:createSuccessResponse({
            "services": services,
            "query": searchQuery,
            "total": services.length()
        });
    }
    
    // Private helper functions
    
    private function createDefaultAdminUser(string serviceId, string email) returns string|error {
        // This would typically create a user in a separate users collection
        // For now, return a message about admin user creation
        return "Admin user created with email: " + email + ". Default password: admin123";
    }
    
    private function getDefaultPermissions(string role) returns string[] {
        return match role {
            "admin" => ["read", "write", "delete", "manage_users", "manage_service"],
            "manager" => ["read", "write", "manage_users"],
            "staff" => ["read", "write"],
            _ => ["read"]
        };
    }
} 