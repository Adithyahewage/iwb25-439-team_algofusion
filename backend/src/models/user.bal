// User Data Models

import ballerina/time;

// User record type for authentication
public type AuthUser record {
    string id;
    string courierServiceId;
    string email;
    string passwordHash;
    string name;
    string role;
    string[] permissions;
    time:Utc createdAt;
    time:Utc? lastLogin;
    boolean isActive;
};

// User Login Request
public type UserLogin record {
    string email;
    string password;
    string courierServiceId;
};

// User Login Response
public type UserLoginResponse record {
    string token;
    string refreshToken;
    AuthUser user;
    time:Utc expiresAt;
};

// User Profile
public type UserProfile record {
    string id;
    string name;
    string email;
    string role;
    string[] permissions;
    time:Utc createdAt;
    time:Utc? lastLogin;
};

// Password Change Request
public type PasswordChange record {
    string currentPassword;
    string newPassword;
    string confirmPassword;
};

// User Permissions
public const string PERMISSION_READ = "read";
public const string PERMISSION_WRITE = "write";
public const string PERMISSION_DELETE = "delete";
public const string PERMISSION_MANAGE_USERS = "manage_users";
public const string PERMISSION_MANAGE_SERVICE = "manage_service";
public const string PERMISSION_VIEW_ANALYTICS = "view_analytics";

// User Roles
public const string ROLE_ADMIN = "admin";
public const string ROLE_MANAGER = "manager";
public const string ROLE_STAFF = "staff";
public const string ROLE_DRIVER = "driver";

// Default permissions for each role
public const string[] ADMIN_PERMISSIONS = [
    PERMISSION_READ,
    PERMISSION_WRITE,
    PERMISSION_DELETE,
    PERMISSION_MANAGE_USERS,
    PERMISSION_MANAGE_SERVICE,
    PERMISSION_VIEW_ANALYTICS
];

public const string[] MANAGER_PERMISSIONS = [
    PERMISSION_READ,
    PERMISSION_WRITE,
    PERMISSION_MANAGE_USERS,
    PERMISSION_VIEW_ANALYTICS
];

public const string[] STAFF_PERMISSIONS = [
    PERMISSION_READ,
    PERMISSION_WRITE
];

public const string[] DRIVER_PERMISSIONS = [
    PERMISSION_READ,
    PERMISSION_WRITE
];

// Function to get default permissions for a role
public function getDefaultPermissions(string role) returns string[] {
    return match role {
        ROLE_ADMIN => ADMIN_PERMISSIONS,
        ROLE_MANAGER => MANAGER_PERMISSIONS,
        ROLE_STAFF => STAFF_PERMISSIONS,
        ROLE_DRIVER => DRIVER_PERMISSIONS,
        _ => [PERMISSION_READ]
    };
}

// Function to check if user has permission
public function hasPermission(string[] userPermissions, string requiredPermission) returns boolean {
    return userPermissions.indexOf(requiredPermission) >= 0;
}

// Function to check if user has any of the required permissions
public function hasAnyPermission(string[] userPermissions, string[] requiredPermissions) returns boolean {
    foreach string permission in requiredPermissions {
        if (hasPermission(userPermissions, permission)) {
            return true;
        }
    }
    return false;
}

// Function to check if user has all required permissions
public function hasAllPermissions(string[] userPermissions, string[] requiredPermissions) returns boolean {
    foreach string permission in requiredPermissions {
        if (!hasPermission(userPermissions, permission)) {
            return false;
        }
    }
    return true;
} 