// import ballerina/time;

public type CourierService record {
    // id is omitted since MongoDB auto-generates it
    string name;
    string email;
    string password;
    string phone;
    string address;
    string logo;
    string createdAt;
    string updatedAt;
    boolean verified;
    string verificationToken;
};

public type RefreshTokenRequest record {
    string refresh_token;
};

public type TokenResponse record {
    string access_token;
    string refresh_token;
};

public type SignupRequest record {
    string name;
    string email;
    string password;
};

public type LoginRequest record {
    string email;
    string password;
};

public type LoginResponse record {
    string email;
    boolean success;
};

public type ErrorResponse record {
    string message;
    int statusCode;
};
