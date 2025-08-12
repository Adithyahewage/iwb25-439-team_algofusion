// Courier Service Data Models

public type CourierService record {
    string id;
    string name;
    string email;
    string phone;
    string address;
    string? logo;
    string[] serviceAreas;
};

public type CourierServiceRegistration record {
    string name;
    string email;
    string phone;
    string address;
    string? logo;
    string[] serviceAreas;
};

public type CourierServiceUpdate record {
    string? name;
    string? phone;
    string? address;
    string? logo;
    string[]? serviceAreas;
};

public type CourierServiceResponse record {
    string id;
    string name;
    string email;
    string phone;
    string address;
    string? logo;
    string[] serviceAreas;
};

public type CourierServiceListResponse record {
    CourierServiceResponse[] services;
    int total;
    int page;
    int pageSize;
};

// Admin user for the entire system
public type AdminUser record {
    string id;
    string email;
    string name;
    string passwordHash;
};

// Admin login request
public type AdminLogin record {
    string email;
    string password;
};

// Admin login response
public type AdminLoginResponse record {
    string token;
    AdminUser user;
};
