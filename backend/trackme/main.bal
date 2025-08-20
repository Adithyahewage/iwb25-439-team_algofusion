import ballerina/crypto;
import ballerina/http;

// JWT signing key - in production, this should be in a secure configuration
configurable string JWT_SECRET = "VMo5+0yeh8WMemqrB/2IkmZ8HXHCkqeGC51j3eMoJZF7qBdfm4QXMGekX1yiRveZc49Cw+lTv1EdCSdGIJXx6A==";

// Function to hash passwords using SHA-256
function hashPassword(string password) returns string {
    byte[] hashedBytes = crypto:hashSha256(password.toBytes());
    return hashedBytes.toBase16();
}

listener http:Listener ln = new (8081);
public function main() {

}
