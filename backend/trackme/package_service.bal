import trackme.mongodb;

import ballerina/http;
//import ballerina/log;
import ballerina/time;
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

service /api/packages on ln {

    // Create new package
    resource function post create(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();

        // Validate required fields
        if !(payload.trackingId is string) {
            http:Response badRequest = new;
            badRequest.statusCode = 400;
            badRequest.setJsonPayload({"error": "trackingId is required"});
            check caller->respond(badRequest);
            return;
        }

        Package newPackage = check payload.cloneWithType(Package);

        // Auto-assign trackingId if missing
        if newPackage.trackingId == "" {
            newPackage.trackingId = uuid:createType1AsString();
        }

        // Set createdAt if not provided
        if newPackage.createdAt == "" {
            newPackage.createdAt = time:utcToString(time:utcNow());
        }

        // Insert into DB
        check mongodb:packageCollection->insertOne(newPackage);

        http:Response response = new;
        response.statusCode = 201;
        response.setJsonPayload({"message": "Package created", "trackingId": newPackage.trackingId});
        check caller->respond(response);
    }

    // Get all packages
    resource function get list(http:Caller caller) returns error? {
        stream<Package, error?> pkgStream = check mongodb:packageCollection->find();
        Package[] packages = [];

        record {|Package value;|}? pkgRec = check pkgStream.next();
        while pkgRec is record {|Package value;|} {
            packages.push(pkgRec.value);
            pkgRec = check pkgStream.next();
        }

        json packagesJson = check packages.cloneWithType(json);

        http:Response response = new;
        response.setJsonPayload(packagesJson);
        check caller->respond(response);

    }

    // Get single package by trackingId
    resource function get [string trackingId](http:Caller caller) returns error? {
        map<json> filter = {"trackingId": trackingId};
        record {}|() pkgRecord = check mongodb:packageCollection->findOne(filter);

        if pkgRecord is () {
            http:Response notFound = new;
            notFound.statusCode = 404;
            notFound.setJsonPayload({"error": "Package not found"});
            check caller->respond(notFound);
            return;
        }

        Package pkg = check pkgRecord.toJson().cloneWithType(Package);

        // Convert record to json
        json pkgJson = check pkg.cloneWithType(json);

        http:Response response = new;
        response.setJsonPayload(pkgJson);
        check caller->respond(response);
    }

    // Update package
    resource function put [string trackingId](http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        Package updatedPackage = check payload.cloneWithType(Package);

        // Filter by trackingId
        map<json> filter = {"trackingId": trackingId};

        // Convert the record into json
        json updatedJson = check updatedPackage.cloneWithType(json);

        // Build proper MongoDB update operation
        //json updateOp = {"$set": updatedJson};

        // Perform update
        mongodb:UpdateResult result = check mongodb:packageCollection->updateOne(filter,update = {set: {updatedJson}});

        if result.matchedCount == 0 {
            http:Response notFound = new;
            notFound.statusCode = 404;
            notFound.setJsonPayload({"error": "Package not found"});
            check caller->respond(notFound);
            return;
        }

        http:Response response = new;
        response.setJsonPayload({"message": "Package updated successfully"});
        check caller->respond(response);
    }

    // Delete package
    resource function delete [string trackingId](http:Caller caller) returns error? {
        map<json> filter = {"trackingId": trackingId};
        mongodb:DeleteResult result = check mongodb:packageCollection->deleteOne(filter);

        if result.deletedCount == 0 {
            http:Response notFound = new;
            notFound.statusCode = 404;
            notFound.setJsonPayload({"error": "Package not found"});
            check caller->respond(notFound);
            return;
        }

        http:Response response = new;
        response.setJsonPayload({"message": "Package deleted successfully"});
        check caller->respond(response);
    }
}
