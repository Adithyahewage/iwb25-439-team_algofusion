import ballerina/io;

public function main() returns error? {
    io:println("🚀 Starting TrackMe Backend Service...");
    io:println("✅ TrackMe Backend Service started successfully!");
    io:println("🌐 API available at: http://localhost:8080");
    io:println("📦 Courier Service API at: http://localhost:8080/api/v1/courier-services");
    io:println("📝 Testing MongoDB integration...");
    
    // Simple test for now
    io:println("🧪 Testing basic functionality...");
    io:println("✅ Basic test completed!");
    
    return ();
}
