// Response Utility Functions

public function createSuccessResponse(any data) returns string {
    return "Success: " + data.toString();
}

public function createCreatedResponse(any data) returns string {
    return "Created: " + data.toString();
}

public function createBadRequest(string message) returns string {
    return "Bad Request: " + message;
}

public function createNotFound(string message) returns string {
    return "Not Found: " + message;
}

public function createInternalServerError(string message) returns string {
    return "Internal Server Error: " + message;
}

public function createPaginatedResponse(any[] data, int total, int page, int pageSize) returns string {
    return "Paginated Response: " + data.length().toString() + " items, page " + page.toString();
}
