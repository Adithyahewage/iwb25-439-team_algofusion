import ballerina/http;
import ballerina/jwt;
import ballerina/log;
import ballerina/time;

// Helper method to generate JWT token with fixed customClaims
public function generateJwtToken(User user) returns string|error {
    // Create a proper map for custom claims
    jwt:IssuerConfig issuerConfig = {
        username: user.username, // This sets the 'sub' field
        issuer: "automeet",
        audience: ["automeet-app"],
        expTime: <decimal>time:utcNow()[0] + 36000, // Token valid for 1 hour
        signatureConfig: {
            algorithm: jwt:HS256,
            config: JWT_SECRET
        },
        customClaims: {
            "username": user.username, // Add this explicitly for custom access
            "email": user.email
        }
    };

    string|jwt:Error token = jwt:issue(issuerConfig);

    if (token is jwt:Error) {
        log:printError("Error generating JWT token", token);
        return error("Error generating authentication token");
    }

    return token;
}

// Helper function to extract JWT token from cookie
public function validateAndGetUsernameFromCookie(http:Request request) returns string?|error {
    // Try to get the auth_token cookie
    http:Cookie[] cookies = request.getCookies();
    string? token = ();

    foreach http:Cookie cookie in cookies {
        if cookie.name == "auth_token" {
            token = cookie.value;
            break;
        }
    }

    // If no auth cookie found, check for Authorization header as fallback
    if token is () {
        string authHeader = check request.getHeader("Authorization");

        if authHeader.startsWith("Bearer ") {
            token = authHeader.substring(7);
        } else {
            log:printError("No authentication token found in cookies or headers");
            return ();
        }
    }

    // Validate the JWT token - Using updated structure for JWT 2.13.0
    jwt:ValidatorConfig validatorConfig = {
        issuer: "automeet",
        audience: "automeet-app",
        clockSkew: 60,
        signatureConfig: {
            secret: JWT_SECRET // For HMAC based JWT
        }
    };

    jwt:Payload|error validationResult = jwt:validate(token, validatorConfig);

    if (validationResult is error) {
        log:printError("JWT validation failed", validationResult);
        return ();
    }

    jwt:Payload payload = validationResult;

    // First check if the username might be in the subject field
    if (payload.sub is string) {
        return payload.sub;
    }

    // Direct access to claim using index accessor
    var customClaims = payload["customClaims"];
    if (customClaims is map<json>) {
        var username = customClaims["username"];
        if (username is string) {
            return username;
        }
    }

    // Try to access username directly as a rest field
    var username = payload["username"];
    if (username is string) {
        return username;
    }

    log:printError("Username not found in JWT token");
    return ();
}
