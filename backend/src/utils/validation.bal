// Validation Utility Functions

import ballerina/stringutils;
import ballerina/regex;

// Validate courier service registration
public function validateCourierServiceRegistration(any data) returns boolean {
    if (data is record {}) {
        var recordData = <record {}>data;
        
        // Check required fields
        if (!recordData.hasKey("name") || !recordData.hasKey("email") || 
            !recordData.hasKey("phone") || !recordData.hasKey("address")) {
            return false;
        }
        
        // Validate email format
        if (!isValidEmail(recordData.email)) {
            return false;
        }
        
        // Validate phone format (basic validation)
        if (!isValidPhone(recordData.phone)) {
            return false;
        }
        
        // Validate name length
        if (stringutils:isEmpty(recordData.name) || recordData.name.length() < 2) {
            return false;
        }
        
        // Validate address length
        if (stringutils:isEmpty(recordData.address) || recordData.address.length() < 10) {
            return false;
        }
        
        return true;
    }
    return false;
}

// Validate user creation
public function validateUserCreation(any data) returns boolean {
    if (data is record {}) {
        var recordData = <record {}>data;
        
        // Check required fields
        if (!recordData.hasKey("email") || !recordData.hasKey("name") || 
            !recordData.hasKey("role")) {
            return false;
        }
        
        // Validate email format
        if (!isValidEmail(recordData.email)) {
            return false;
        }
        
        // Validate name length
        if (stringutils:isEmpty(recordData.name) || recordData.name.length() < 2) {
            return false;
        }
        
        // Validate role
        if (!isValidRole(recordData.role)) {
            return false;
        }
        
        return true;
    }
    return false;
}

// Validate email format
public function isValidEmail(string email) returns boolean {
    if (stringutils:isEmpty(email)) {
        return false;
    }
    
    // Basic email regex pattern
    string emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    return regex:matches(email, emailPattern);
}

// Validate phone number format
public function isValidPhone(string phone) returns boolean {
    if (stringutils:isEmpty(phone)) {
        return false;
    }
    
    // Remove all non-digit characters
    string cleanPhone = regex:replaceAll(phone, "[^0-9]", "");
    
    // Check if phone number is between 7 and 15 digits
    return cleanPhone.length() >= 7 && cleanPhone.length() <= 15;
}

// Validate user role
public function isValidRole(string role) returns boolean {
    string[] validRoles = ["admin", "manager", "staff", "driver"];
    return validRoles.indexOf(role) >= 0;
}

// Validate UUID format
public function isValidUUID(string uuid) returns boolean {
    if (stringutils:isEmpty(uuid)) {
        return false;
    }
    
    // UUID v4 pattern
    string uuidPattern = "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";
    return regex:matches(uuid, uuidPattern);
}

// Validate pagination parameters
public function validatePagination(int limit, int offset) returns boolean {
    return limit > 0 && limit <= 100 && offset >= 0;
}

// Validate string length
public function validateStringLength(string value, int minLength, int maxLength) returns boolean {
    if (stringutils:isEmpty(value)) {
        return minLength == 0;
    }
    
    int length = value.length();
    return length >= minLength && length <= maxLength;
}

// Validate array length
public function validateArrayLength(any[] array, int minLength, int maxLength) returns boolean {
    int length = array.length();
    return length >= minLength && length <= maxLength;
}

// Validate required fields in a record
public function validateRequiredFields(any data, string[] requiredFields) returns boolean {
    if (data is record {}) {
        var recordData = <record {}>data;
        
        foreach string field in requiredFields {
            if (!recordData.hasKey(field)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

// Validate optional fields in a record
public function validateOptionalFields(any data, string[] optionalFields) returns boolean {
    if (data is record {}) {
        var recordData = <record {}>data;
        
        foreach string field in recordData.keys() {
            if (optionalFields.indexOf(field) < 0) {
                return false;
            }
        }
        return true;
    }
    return false;
}

// Sanitize string input
public function sanitizeString(string input) returns string {
    if (stringutils:isEmpty(input)) {
        return "";
    }
    
    // Remove potentially dangerous characters
    string sanitized = regex:replaceAll(input, "[<>\"']", "");
    
    // Trim whitespace
    return stringutils:trim(sanitized);
}

// Validate service areas array
public function validateServiceAreas(string[] serviceAreas) returns boolean {
    if (serviceAreas.length() == 0) {
        return true; // Empty array is valid
    }
    
    foreach string area in serviceAreas {
        if (stringutils:isEmpty(area) || area.length() < 2) {
            return false;
        }
    }
    
    return true;
}

// Validate logo URL
public function isValidLogoURL(string logo) returns boolean {
    if (stringutils:isEmpty(logo)) {
        return true; // Empty logo is valid
    }
    
    // Basic URL validation
    string urlPattern = "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$";
    return regex:matches(logo, urlPattern);
} 