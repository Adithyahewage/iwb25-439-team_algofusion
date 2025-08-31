import trackme.mongodb;

import ballerina/http;
import ballerina/log;
import ballerina/uuid;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: true,
        allowHeaders: ["content-type", "authorization"],
        allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
        maxAge: 84900
    }
}

service /api/auth on ln {

    resource function post signup(http:Caller caller, http:Request req) returns error? {

        // Parse the JSON payload from the request body
        json signupPayload = check req.getJsonPayload();

        // Log redacted payload for security (we'll omit the password entirely)
        log:printInfo("New signup request received for user: " + (signupPayload.username is string ? (check signupPayload.username).toString() : "unknown"));

        // Extract all possible fields from the frontend payload
        string username = check signupPayload.username.ensureType();
        string password = check signupPayload.password.ensureType();
        string confirmPassword = check signupPayload.confirmPassword.ensureType();
        

        // Handle the email field - we'll look for it in the payload, but it might be missing
        string email = "";
        if (signupPayload.email is string) {
            email = check signupPayload.email.ensureType();
        }
        string phone = check signupPayload.phone.ensureType();
        string address = check signupPayload.address.ensureType();
        

        // Validate required fields
        if (username == "" || password == "") {
            log:printError("Missing required fields for signup");
            http:Response badRequestResponse = new;
            badRequestResponse.statusCode = 400; // Bad Request status code
            badRequestResponse.setJsonPayload({"error": "Username and password are required fields"});
            check caller->respond(badRequestResponse);
            return;
        }

        if(password != confirmPassword){
            log:printError("passwords not same");
            return ;
        }

        // If email is not provided, use username as email
        if (email == "") {
            email = username;
        }

        // Check if the user already exists in the collection using username field
        map<json> filter = {"username": username};
        stream<User, error?> userStream = check mongodb:userCollection->find(filter);
        record {|User value;|}? existingUser = check userStream.next();

        if (existingUser is record {|User value;|}) {
            log:printError("User already exists");
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 409; // Conflict status code
            conflictResponse.setJsonPayload({"error": "User already exists"});
            check caller->respond(conflictResponse);
            return;
        }

        // Hash the password before storing
        string hashedPassword = hashPassword(password);
        string hashedPassword2 = hashPassword(confirmPassword);

        // Create a new User record with the extracted fields
        User newUser = {
            username: username,
            email: email,
            password: hashedPassword,
            confirmPassword: hashedPassword2,
            phone: phone,
            address: address
        };

        check mongodb:userCollection->insertOne(newUser);

        // Send a success response
        http:Response response = new;
        response.statusCode = 201; // Created status code
        response.setJsonPayload({"message": "User signed up successfully"});
        check caller->respond(response);
    }

    resource function get status(http:Request req) returns LoginResponse|ErrorResponse|error {
        // Extract username from cookie
        string? username = check validateAndGetUsernameFromCookie(req);
        if username is () {
            return {
                message: "User not authenticated",
                statusCode: 401
            };
        }

        // Get user details from database
        map<json> filter = {
            "username": username
        };

        record {}|() userRecord = check mongodb:userCollection->findOne(filter);
        if userRecord is () {
            return {
                message: "User not found",
                statusCode: 404
            };
        }

        // Convert to User type
        json userJson = userRecord.toJson();
        User user = check userJson.cloneWithType(User);

        // Create login response without sensitive data
        LoginResponse response = {
            username: user.username,
            email: user.email,
            success: true
        };

        return response;
    }

    resource function post login(http:Caller caller, http:Request req) returns error? {
        // Parse the JSON payload from the request body
        json loginPayload = check req.getJsonPayload();

        // Log the login attempt without password
        log:printInfo("Login attempt for user: " + (loginPayload.username is string ? (check loginPayload.username).toString() : "unknown"));

        // Convert JSON to LoginRequest type
        LoginRequest loginDetails = check loginPayload.cloneWithType(LoginRequest);

        // First, find the user by username
        map<json> usernameFilter = {"username": loginDetails.username};
        stream<User, error?> userStream = check mongodb:userCollection->find(usernameFilter);
        record {|User value;|}? userRecord = check userStream.next();

        if (userRecord is ()) {
            log:printError("Invalid username or password");
            http:Response unauthorizedResponse = new;
            unauthorizedResponse.statusCode = 401; // Unauthorized status code
            unauthorizedResponse.setJsonPayload({"error": "Invalid username or password"});
            check caller->respond(unauthorizedResponse);
            return;
        }

        User user = userRecord.value;

        // Hash the provided password and compare with stored hash
        string hashedInputPassword = hashPassword(loginDetails.password);

        if (hashedInputPassword != user.password) {
            log:printError("Invalid username or password");
            http:Response unauthorizedResponse = new;
            unauthorizedResponse.statusCode = 401; // Unauthorized status code
            unauthorizedResponse.setJsonPayload({"error": "Invalid username or password"});
            check caller->respond(unauthorizedResponse);
            return;
        }

        // Generate a new refresh token
        string refreshToken = uuid:createType1AsString();

        // Update the user record with the new refresh token
        map<json> filter = {"username": user.username};
        mongodb:Update updateOperation = {
            "set": {"email_refresh_token": refreshToken}
        };
        _ = check mongodb:userCollection->updateOne(filter, updateOperation);

        // Generate JWT token 
        string token = check generateJwtToken(user);

        // Create login response - no token in the response body
        LoginResponse loginResponse = {
            username: user.username,
            email: user.email,
            success: true
        };

        json loginResponseJson = loginResponse.toJson();

        // Send the response with the JWT token in HttpOnly secure cookie
        http:Response response = new;
        response.setJsonPayload(loginResponseJson);

        // Set the JWT token as an HttpOnly secure cookie
        http:Cookie jwtCookie = new ("auth_token", token,
            path = "/",
            httpOnly = true,
            secure = true,
            maxAge = 3600 // 1 hour, matching the JWT expiration
        );

        // Set the refresh token in a separate cookie with longer expiration
        http:Cookie refreshCookie = new ("refresh_token", refreshToken,
            path = "/api/auth/refresh", // Restrict to refresh endpoint only
            httpOnly = true,
            secure = true,
            maxAge = 2592000 // 30 days
        );

        response.addCookie(jwtCookie);
        response.addCookie(refreshCookie);
        check caller->respond(response);
    }

    resource function post refresh(http:Caller caller, http:Request req) returns error? {
        // Get the refresh token from the cookie
        string? refreshToken = ();
        http:Cookie[] cookies = req.getCookies();

        foreach http:Cookie cookie in cookies {
            if cookie.name == "refresh_token" {
                refreshToken = cookie.value;
                break;
            }
        }

        // If no refresh token in cookie, try to get it from the request body
        if refreshToken is () {
            json|http:ClientError jsonPayload = req.getJsonPayload();

            if jsonPayload is http:ClientError {
                http:Response badRequestResponse = new;
                badRequestResponse.statusCode = 400;
                badRequestResponse.setJsonPayload({"error": "Invalid request format"});
                check caller->respond(badRequestResponse);
                return;
            }

            RefreshTokenRequest tokenRequest = check jsonPayload.cloneWithType(RefreshTokenRequest);
            refreshToken = tokenRequest.refresh_token;
        }

        // Validate the refresh token exists
        if refreshToken is () || refreshToken == "" {
            http:Response unauthorizedResponse = new;
            unauthorizedResponse.statusCode = 401;
            unauthorizedResponse.setJsonPayload({"error": "Refresh token is required"});
            check caller->respond(unauthorizedResponse);
            return;
        }

        // Find user by refresh token
        map<json> filter = {"email_refresh_token": refreshToken};
        stream<User, error?> userStream = check mongodb:userCollection->find(filter);
        record {|User value;|}? userRecord = check userStream.next();

        if userRecord is () {
            // If no user found with this refresh token, try looking for Google refresh token
            map<json> googleFilter = {"refresh_token": refreshToken};
            stream<User, error?> googleUserStream = check mongodb:userCollection->find(googleFilter);
            userRecord = check googleUserStream.next();

            if userRecord is () {
                log:printError("Invalid refresh token");
                http:Response unauthorizedResponse = new;
                unauthorizedResponse.statusCode = 401;
                unauthorizedResponse.setJsonPayload({"error": "Invalid refresh token"});
                check caller->respond(unauthorizedResponse);
                return;
            }
        }

        // Safely unwrap the record since we now know it's not null
        User user;
        if userRecord is record {|User value;|} {
            user = userRecord.value;
        } else {
            // This should never happen since we checked above, but added for completeness
            log:printError("Unexpected error: userRecord is not of the expected type");
            http:Response errorResponse = new;
            errorResponse.statusCode = 500;
            errorResponse.setJsonPayload({"error": "Internal server error"});
            check caller->respond(errorResponse);
            return;
        }

        // Generate a new refresh token
        string newRefreshToken = uuid:createType1AsString();

        // Update the user record with the new refresh token
        map<json> updateFilter = {"username": user.username};
        mongodb:Update updateOperation = {
            "set": {"email_refresh_token": newRefreshToken}
        };
        _ = check mongodb:userCollection->updateOne(updateFilter, updateOperation);

        // Generate a new JWT token
        string newToken = check generateJwtToken(user);

        // Create the response
        http:Response response = new;

        // Set the new JWT token as an HttpOnly secure cookie
        http:Cookie jwtCookie = new ("auth_token", newToken,
            path = "/",
            httpOnly = true,
            secure = true,
            maxAge = 3600 // 1 hour, matching the JWT expiration
        );

        // Set the new refresh token in a separate cookie with longer expiration
        http:Cookie refreshCookie = new ("refresh_token", newRefreshToken,
            path = "/api/auth/refresh", // Restrict to refresh endpoint only
            httpOnly = true,
            secure = true,
            maxAge = 2592000 // 30 days
        );

        response.addCookie(jwtCookie);
        response.addCookie(refreshCookie);

        // Include minimal user info in the response
        json responseBody = {
            "username": user.username,
            "email": user.email,
            "message": "Token refreshed successfully"
        };

        response.setJsonPayload(responseBody);
        check caller->respond(response);
    }

    resource function get logout(http:Caller caller) returns error? {
        http:Response response = new;

        // Log the logout attempt
        log:printInfo("User logout requested");

        // Create an expired cookie to clear the auth token
        http:Cookie expiredCookie = new ("auth_token", "",
            path = "/",
            httpOnly = true,
            secure = true,
            maxAge = 0 // Immediately expire the cookie
        );

        // Add CORS headers for cross-origin requests
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.addCookie(expiredCookie);
        response.setJsonPayload({"message": "Logged out successfully"});
        check caller->respond(response);

        log:printInfo("User logged out successfully");
    }

}
