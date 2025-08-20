import ballerina/email;
import ballerina/http;
import ballerina/jwt;
import ballerina/log;
import ballerina/time;

// SMTP configuration (replace with your SMTP server details)
const string SMTP_HOST = "smtp.gmail.com";
const int SMTP_PORT = 587;
const string SMTP_USERNAME = "adithyahewage69@gmail.com";
const string SMTP_PASSWORD = "tfpmdekekeizwoir";
const string FROM_EMAIL = "adithyahewage69@gmail.com";

// Helper to send verification email
public function sendVerificationEmail(string toEmail, string verificationToken) returns error? {
    string verificationUrl = "http://localhost:8081/api/auth/verify?token=" + verificationToken;
    string subject = "Verify your TrackMe account";
    string htmlBody = "<p>Thank you for registering with TrackMe!</p>" +
        "<p>Please verify your email by clicking the link below:</p>" +
        "<a href='" + verificationUrl + "'>Verify Email</a>";
    email:SmtpConfiguration smtpConfig = {
        port: SMTP_PORT
    };
    email:SmtpClient smtpClient = check new (SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, smtpConfig);
    email:Message msg = {
        to: [toEmail],
        subject: subject,
        htmlBody: htmlBody
    };
    check smtpClient->sendMessage(msg);
    // No close() method in this version
}

// No import needed for types in the same module

// Helper method to generate JWT token for CourierService
public function generateJwtToken(CourierService courier) returns string|error {
    jwt:IssuerConfig issuerConfig = {
        username: courier.email, // Use email as subject (unique)
        issuer: "automeet",
        audience: ["automeet-app"],
        expTime: <decimal>time:utcNow()[0] + 36000, // Token valid for 1 hour
        signatureConfig: {
            algorithm: jwt:HS256,
            config: JWT_SECRET
        },
        customClaims: {
            "name": courier.name,
            "email": courier.email,
            "phone": courier.phone,
            "address": courier.address,
            "logo": courier.logo
        }
    };

    string|jwt:Error token = jwt:issue(issuerConfig);

    if (token is jwt:Error) {
        log:printError("Error generating JWT token", token);
        return error("Error generating authentication token");
    }

    return token;
}

// Helper function to extract JWT token from cookie and get email (subject)
public function validateAndGetEmailFromCookie(http:Request request) returns string?|error {
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

    jwt:ValidatorConfig validatorConfig = {
        issuer: "automeet",
        audience: "automeet-app",
        clockSkew: 60,
        signatureConfig: {
            secret: JWT_SECRET
        }
    };

    jwt:Payload|error validationResult = jwt:validate(token, validatorConfig);
    if (validationResult is error) {
        log:printError("JWT validation failed", validationResult);
        return ();
    }
    jwt:Payload payload = validationResult;

    // Use email as subject
    if (payload.sub is string) {
        return payload.sub;
    }

    // Try to access email from custom claims
    var customClaims = payload["customClaims"];
    if (customClaims is map<json>) {
        var email = customClaims["email"];
        if (email is string) {
            return email;
        }
    }

    log:printError("Email not found in JWT token");
    return ();
}
