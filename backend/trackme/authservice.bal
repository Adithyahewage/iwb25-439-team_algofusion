import trackme.mongodb;

// No import needed for types in the same module

import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerina/uuid;

// Listener with CORS config
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: true,
        allowHeaders: ["content-type", "authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}

service /api/auth on ln {

    resource function post signup(http:Caller caller, http:Request req) returns error? {
        json signupPayload = check req.getJsonPayload();
        log:printInfo("New signup request received for courier: " + (signupPayload.email is string ? (check signupPayload.email).toString() : "unknown"));

        // Extract required fields
        string name = check signupPayload.name.ensureType();
        string email = check signupPayload.email.ensureType();
        string password = check signupPayload.password.ensureType();

        // Optional fields (default to empty)
        string phone = "";
        string address = "";
        string logo = "";
        if signupPayload.phone is string {
            phone = check signupPayload.phone.ensureType();
        }
        if signupPayload.address is string {
            address = check signupPayload.address.ensureType();
        }
        if signupPayload.logo is string {
            logo = check signupPayload.logo.ensureType();
        }

        // Validate required fields
        if (name == "" || email == "" || password == "") {
            log:printError("Missing required fields for signup");
            http:Response badRequestResponse = new;
            badRequestResponse.statusCode = 400;
            badRequestResponse.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            badRequestResponse.setHeader("Access-Control-Allow-Credentials", "true");
            badRequestResponse.setJsonPayload({"error": "Name, email, and password are required fields"});
            check caller->respond(badRequestResponse);
            return;
        }

        // Check if the courier already exists in the collection using email field
        map<json> filter = {"email": email};
        stream<CourierService, error?> courierStream = check mongodb:userCollection->find(filter);
        record {|CourierService value;|}? existingCourier = check courierStream.next();
        if (existingCourier is record {|CourierService value;|}) {
            log:printError("Courier already exists");
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 409;
            conflictResponse.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            conflictResponse.setHeader("Access-Control-Allow-Credentials", "true");
            conflictResponse.setJsonPayload({"error": "Courier already exists"});
            check caller->respond(conflictResponse);
            return;
        }

        // Hash the password before storing
        string hashedPassword = hashPassword(password);

        // Set timestamps as time:Utc
        string now = time:utcToString(time:utcNow());

        // Generate verification token
        string verificationToken = uuid:createType1AsString();

        // Create a new CourierService record
        CourierService newCourier = {
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            address: address,
            logo: logo,
            createdAt: now,
            updatedAt: now,
            verified: false,
            verificationToken: verificationToken
        };

        check mongodb:userCollection->insertOne(newCourier);

        // Send verification email
        check sendVerificationEmail(email, verificationToken);

        http:Response response = new;
        response.statusCode = 201;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setJsonPayload({"message": "Courier signed up successfully. Please check your email to verify your account."});
        check caller->respond(response);
    }

    // Add additional info after verification
    resource function post addinfo(http:Caller caller, http:Request req) returns error? {
        // Extract email from cookie/JWT
        string? email = check validateAndGetEmailFromCookie(req);
        if email is () {
            http:Response unauthorized = new;
            unauthorized.statusCode = 401;
            unauthorized.setJsonPayload({"error": "Not authenticated"});
            check caller->respond(unauthorized);
            return;
        }

        // Find the courier by email
        map<json> filter = {"email": email};
        record {}|() courierRecord = check mongodb:userCollection->findOne(filter);
        if courierRecord is () {
            http:Response notFound = new;
            notFound.statusCode = 404;
            notFound.setJsonPayload({"error": "Courier not found"});
            check caller->respond(notFound);
            return;
        }
        json courierJson = courierRecord.toJson();
        CourierService courier = check courierJson.cloneWithType(CourierService);

        // Only allow if verified
        if (!courier.verified) {
            http:Response forbidden = new;
            forbidden.statusCode = 403;
            forbidden.setJsonPayload({"error": "Account not verified. Cannot add info."});
            check caller->respond(forbidden);
            return;
        }

        // Parse additional info from request
        json payload = check req.getJsonPayload();
        string phone = courier.phone;
        string address = courier.address;
        string logo = courier.logo;
        if payload.phone is string {
            phone = check payload.phone.ensureType();
        }
        if payload.address is string {
            address = check payload.address.ensureType();
        }
        if payload.logo is string {
            logo = check payload.logo.ensureType();
        }

        // Update the courier record in DB with updatedAt as time:Utc
        map<json> updateFilter = {"email": email};
        mongodb:Update updateOperation = {
            "set": {
                "phone": phone,
                "address": address,
                "logo": logo,
                "updatedAt": time:utcToString(time:utcNow())
            }
        };
        _ = check mongodb:userCollection->updateOne(updateFilter, updateOperation);

        http:Response ok = new;
        ok.statusCode = 200;
        ok.setJsonPayload({"message": "Additional info updated successfully"});
        check caller->respond(ok);
    }

    resource function get status(http:Request req) returns json|error {
        string? email = check validateAndGetEmailFromCookie(req);
        if email is () {
            return {
                message: "Courier not authenticated",
                statusCode: 401
            };
        }

        map<json> filter = {"email": email};
        record {}|() courierRecord = check mongodb:userCollection->findOne(filter);
        if courierRecord is () {
            return {
                message: "Courier not found",
                statusCode: 404
            };
        }

        json courierJson = courierRecord.toJson();
        CourierService courier = check courierJson.cloneWithType(CourierService);

        map<anydata> response = {
            name: courier.name,
            email: courier.email,
            phone: courier.phone,
            address: courier.address,
            logo: courier.logo,
            createdAt: courier.createdAt,
            updatedAt: courier.updatedAt
        };
        return <json>response;
    }

    resource function post login(http:Caller caller, http:Request req) returns error? {
        json loginPayload = check req.getJsonPayload();
        log:printInfo("Login attempt for courier: " + (loginPayload.email is string ? (check loginPayload.email).toString() : "unknown"));

        string email = check loginPayload.email.ensureType();
        string password = check loginPayload.password.ensureType();

        map<json> emailFilter = {"email": email};
        stream<CourierService, error?> courierStream = check mongodb:userCollection->find(emailFilter);
        record {|CourierService value;|}? courierRecord = check courierStream.next();
        if (courierRecord is ()) {
            log:printError("Invalid email or password");
            http:Response unauthorizedResponse = new;
            unauthorizedResponse.statusCode = 401;
            unauthorizedResponse.setJsonPayload({"error": "Invalid email or password"});
            check caller->respond(unauthorizedResponse);
            return;
        }
        CourierService courier = courierRecord.value;

        if (!courier.verified) {
            log:printError("Account not verified");
            http:Response forbiddenResponse = new;
            forbiddenResponse.statusCode = 403;
            forbiddenResponse.setJsonPayload({"error": "Account not verified. Please check your email."});
            check caller->respond(forbiddenResponse);
            return;
        }

        string hashedInputPassword = hashPassword(password);
        if (hashedInputPassword != courier.password) {
            log:printError("Invalid email or password");
            http:Response unauthorizedResponse = new;
            unauthorizedResponse.statusCode = 401;
            unauthorizedResponse.setJsonPayload({"error": "Invalid email or password"});
            check caller->respond(unauthorizedResponse);
            return;
        }

        string refreshToken = uuid:createType1AsString();

        map<json> filter = {"email": courier.email};
        mongodb:Update updateOperation = {
            "set": {"email_refresh_token": refreshToken}
        };
        _ = check mongodb:userCollection->updateOne(filter, updateOperation);

        string token = check generateJwtToken(courier);

        map<anydata> loginResponse = {
            name: courier.name,
            email: courier.email,
            phone: courier.phone,
            address: courier.address,
            logo: courier.logo,
            createdAt: courier.createdAt,
            updatedAt: courier.updatedAt,
            success: true
        };

        http:Response response = new;
        response.setJsonPayload(<json>loginResponse);

        http:Cookie jwtCookie = new ("auth_token", token,
            path = "/",
            httpOnly = true,
            secure = true,
            maxAge = 3600
        );
        http:Cookie refreshCookie = new ("refresh_token", refreshToken,
            path = "/api/auth/refresh",
            httpOnly = true,
            secure = true,
            maxAge = 2592000
        );
        response.addCookie(jwtCookie);
        response.addCookie(refreshCookie);
        check caller->respond(response);
    }

    resource function post refresh(http:Caller caller, http:Request req) returns error? {
        string? refreshToken = ();
        http:Cookie[] cookies = req.getCookies();
        foreach http:Cookie cookie in cookies {
            if cookie.name == "refresh_token" {
                refreshToken = cookie.value;
                break;
            }
        }
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
        if refreshToken is () || refreshToken == "" {
            http:Response unauthorizedResponse = new;
            unauthorizedResponse.statusCode = 401;
            unauthorizedResponse.setJsonPayload({"error": "Refresh token is required"});
            check caller->respond(unauthorizedResponse);
            return;
        }
        map<json> filter = {"email_refresh_token": refreshToken};
        stream<CourierService, error?> courierStream = check mongodb:userCollection->find(filter);
        record {|CourierService value;|}? courierRecord = check courierStream.next();
        if courierRecord is () {
            log:printError("Invalid refresh token");
            http:Response unauthorizedResponse = new;
            unauthorizedResponse.statusCode = 401;
            unauthorizedResponse.setJsonPayload({"error": "Invalid refresh token"});
            check caller->respond(unauthorizedResponse);
            return;
        }
        CourierService courier = courierRecord.value;
        string newRefreshToken = uuid:createType1AsString();
        map<json> updateFilter = {"email": courier.email};
        mongodb:Update updateOperation = {
            "set": {"email_refresh_token": newRefreshToken}
        };
        _ = check mongodb:userCollection->updateOne(updateFilter, updateOperation);
        string newToken = check generateJwtToken(courier);
        http:Response response = new;
        http:Cookie jwtCookie = new ("auth_token", newToken,
            path = "/",
            httpOnly = true,
            secure = true,
            maxAge = 3600
        );
        http:Cookie refreshCookie = new ("refresh_token", newRefreshToken,
            path = "/api/auth/refresh",
            httpOnly = true,
            secure = true,
            maxAge = 2592000
        );
        response.addCookie(jwtCookie);
        response.addCookie(refreshCookie);
        map<anydata> responseBody = {
            name: courier.name,
            email: courier.email,
            phone: courier.phone,
            address: courier.address,
            logo: courier.logo,
            createdAt: courier.createdAt,
            updatedAt: courier.updatedAt,
            message: "Token refreshed successfully"
        };
        response.setJsonPayload(<json>responseBody);
        check caller->respond(response);
    }

    resource function get logout(http:Caller caller) returns error? {
        http:Response response = new;
        log:printInfo("Courier logout requested");
        http:Cookie expiredCookie = new ("auth_token", "",
            path = "/",
            httpOnly = true,
            secure = true,
            maxAge = 0
        );
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.addCookie(expiredCookie);
        response.setJsonPayload({"message": "Logged out successfully"});
        check caller->respond(response);
        log:printInfo("Courier logged out successfully");
    }

    resource function get verify(http:Caller caller, http:Request req) returns error? {
        string? token = req.getQueryParamValue("token");
        if token is () || token == "" {
            http:Response badRequest = new;
            badRequest.statusCode = 400;
            badRequest.setJsonPayload({"error": "Verification token is required"});
            check caller->respond(badRequest);
            return;
        }
        map<json> filter = {"verificationToken": token};
        stream<CourierService, error?> courierStream = check mongodb:userCollection->find(filter);
        record {|CourierService value;|}? courierRecord = check courierStream.next();
        if (courierRecord is ()) {
            http:Response notFound = new;
            notFound.statusCode = 404;
            notFound.setJsonPayload({"error": "Invalid or expired verification token"});
            check caller->respond(notFound);
            return;
        }
        CourierService courier = courierRecord.value;
        map<json> updateFilter = {"email": courier.email};
        mongodb:Update updateOperation = {
            "set": {"verified": true, "verificationToken": ""}
        };
        _ = check mongodb:userCollection->updateOne(updateFilter, updateOperation);
        http:Response ok = new;
        ok.statusCode = 200;
        ok.setJsonPayload({"message": "Account verified successfully. You can now login."});
        check caller->respond(ok);
    }
}
