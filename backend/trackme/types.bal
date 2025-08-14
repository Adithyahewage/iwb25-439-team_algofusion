public type User record {
	string username;
	string name;
	string password;
};

public type RefreshTokenRequest record {
    string refresh_token;
};

public type TokenResponse record {
    string access_token;
    string refresh_token;
};

public type SignupRequest record {
    string username;
    string name;
    string password;
};

public type LoginRequest record {
    string username;
    string password;
};

public type LoginResponse record {
    string username;
    string name;
    boolean success;
};


public type ErrorResponse record {
    string message;
    int statusCode;
};