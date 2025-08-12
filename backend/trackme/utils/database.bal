// Database Utility Functions
import ballerina/io;

public type DatabaseConfig record {
    string uri;
    string database;
    string? username;
    string? password;
    int maxPoolSize;
    int minPoolSize;
    int maxIdleTime;
};

public function getDatabaseConfig() returns DatabaseConfig {
    return {
        uri: "mongodb+srv://chamod:1234@cluster0.da9rgkc.mongodb.net/TrackMeDB?retryWrites=true&w=majority&appName=Cluster0",
        database: "TrackMeDB",
        username: "chamod",
        password: "1234",
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTime: 30000
    };
}

public function initializeSampleData() returns error? {
    io:println("Sample data initialization placeholder");
    return ();
}
