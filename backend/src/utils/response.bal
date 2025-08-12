// Response Utility Functions

import ballerina/http;
import ballerina/time;

// Create success response
public function createSuccessResponse(any data) returns http:Response {
    var responseBody = {
        "success": true,
        "message": "Operation completed successfully",
        "data": data,
        "timestamp": time:utcNow()
    };
    
    return http:Response {
        statusCode: 200,
        mediaType: "application/json",
        payload: responseBody
    };
}

// Create success response with custom message
public function createSuccessResponseWithMessage(any data, string message) returns http:Response {
    var responseBody = {
        "success": true,
        "message": message,
        "data": data,
        "timestamp": time:utcNow()
    };
    
    return http:Response {
        statusCode: 200,
        mediaType: "application/json",
        payload: responseBody
    };
}

// Create created response (201)
public function createCreatedResponse(any data, string message) returns http:Response {
    var responseBody = {
        "success": true,
        "message": message,
        "data": data,
        "timestamp": time:utcNow()
    };
    
    return http:Response {
        statusCode: 201,
        mediaType: "application/json",
        payload: responseBody
    };
}

// Create bad request response (400)
public function createBadRequest(string message) returns http:BadRequest {
    var responseBody = {
        "success": false,
        "message": message,
        "error": "BAD_REQUEST",
        "timestamp": time:utcNow()
    };
    
    return http:BadRequest {
        body: responseBody
    };
}

// Create unauthorized response (401)
public function createUnauthorized(string message) returns http:Unauthorized {
    var responseBody = {
        "success": false,
        "message": message,
        "error": "UNAUTHORIZED",
        "timestamp": time:utcNow()
    };
    
    return http:Unauthorized {
        body: responseBody
    };
}

// Create forbidden response (403)
public function createForbidden(string message) returns http:Forbidden {
    var responseBody = {
        "success": false,
        "message": message,
        "error": "FORBIDDEN",
        "timestamp": time:utcNow()
    };
    
    return http:Forbidden {
        body: responseBody
    };
}

// Create not found response (404)
public function createNotFound(string message) returns http:NotFound {
    var responseBody = {
        "success": false,
        "message": message,
        "error": "NOT_FOUND",
        "timestamp": time:utcNow()
    };
    
    return http:NotFound {
        body: responseBody
    };
}

// Create conflict response (409)
public function createConflict(string message) returns http:Response {
    var responseBody = {
        "success": false,
        "message": message,
        "error": "CONFLICT",
        "timestamp": time:utcNow()
    };
    
    return http:Response {
        statusCode: 409,
        mediaType: "application/json",
        payload: responseBody
    };
}

// Create validation error response (422)
public function createValidationError(string message, any details) returns http:Response {
    var responseBody = {
        "success": false,
        "message": message,
        "error": "VALIDATION_ERROR",
        "details": details,
        "timestamp": time:utcNow()
    };
    
    return http:Response {
        statusCode: 422,
        mediaType: "application/json",
        payload: responseBody
    };
}

// Create internal server error response (500)
public function createInternalServerError(string message) returns http:InternalServerError {
    var responseBody = {
        "success": false,
        "message": message,
        "error": "INTERNAL_SERVER_ERROR",
        "timestamp": time:utcNow()
    };
    
    return http:InternalServerError {
        body: responseBody
    };
}

// Create service unavailable response (503)
public function createServiceUnavailable(string message) returns http:Response {
    var responseBody = {
        "success": false,
        "message": message,
        "error": "SERVICE_UNAVAILABLE",
        "timestamp": time:utcNow()
    };
    
    return http:Response {
        statusCode: 503,
        mediaType: "application/json",
        payload: responseBody
    };
}

// Create paginated response
public function createPaginatedResponse(any data, int limit, int offset, int total) returns http:Response {
    var responseBody = {
        "success": true,
        "message": "Data retrieved successfully",
        "data": data,
        "pagination": {
            "limit": limit,
            "offset": offset,
            "total": total,
            "totalPages": (total + limit - 1) / limit
        },
        "timestamp": time:utcNow()
    };
    
    return http:Response {
        statusCode: 200,
        mediaType: "application/json",
        payload: responseBody
    };
}

// Create error response with custom status code
public function createErrorResponse(int statusCode, string message, string errorType) returns http:Response {
    var responseBody = {
        "success": false,
        "message": message,
        "error": errorType,
        "timestamp": time:utcNow()
    };
    
    return http:Response {
        statusCode: statusCode,
        mediaType: "application/json",
        payload: responseBody
    };
} 