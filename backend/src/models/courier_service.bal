// Courier Service Data Models

import ballerina/time;

// Courier Service record type
public type CourierService record {
    string id;
    string name;
    string email;
    string phone;
    string address;
    string logo;
    string[] serviceAreas;
    User[] users;
    time:Utc createdAt;
    time:Utc updatedAt;
};

// User record type within courier service
public type User record {
    string id;
    string email;
    string name;
    string role;
    string[] permissions;
    time:Utc createdAt;
    time:Utc? lastLogin;
};

// Courier Service Registration Request
public type CourierServiceRegistration record {
    string name;
    string email;
    string phone;
    string address;
    string? logo;
    string[]? serviceAreas;
};

// Courier Service Update Request
public type CourierServiceUpdate record {
    string? name;
    string? phone;
    string? address;
    string? logo;
    string[]? serviceAreas;
};

// User Creation Request
public type UserCreation record {
    string email;
    string name;
    string role;
    string[]? permissions;
};

// User Update Request
public type UserUpdate record {
    string? name;
    string? role;
    string[]? permissions;
};

// Search Query Parameters
public type CourierServiceSearch record {
    string? name;
    string? email;
    string? serviceArea;
    int? limit;
    int? offset;
};

// Pagination Response
public type PaginationInfo record {
    int limit;
    int offset;
    int total;
    int totalPages;
};

// API Response wrapper
public type ApiResponse<T> record {
    boolean success;
    string message;
    T? data;
    string? error;
    time:Utc timestamp;
};
