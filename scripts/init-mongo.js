// MongoDB Initialization Script for TrackMe
// This script runs when the MongoDB container starts for the first time

print('🚀 Initializing TrackMe database...');

// Switch to the trackme database
db = db.getSiblingDB('trackme');

// Create collections
print('Creating collections...');
db.createCollection('parcels');
db.createCollection('users');
db.createCollection('notifications');

// Create indexes for parcels collection
print('Creating indexes for parcels collection...');

// Geospatial indexes for location queries
db.parcels.createIndex(
    { "locations.pickup": "2dsphere" },
    { name: "pickup_location_index" }
);

db.parcels.createIndex(
    { "locations.delivery": "2dsphere" },
    { name: "delivery_location_index" }
);

// Index for location history
db.parcels.createIndex(
    { "locationHistory.coordinates": "2dsphere" },
    { name: "location_history_index" }
);

// Regular indexes for common queries
db.parcels.createIndex(
    { "status": 1 },
    { name: "status_index" }
);

db.parcels.createIndex(
    { "recipient.email": 1 },
    { name: "recipient_email_index" }
);

db.parcels.createIndex(
    { "metadata.createdAt": -1 },
    { name: "created_at_index" }
);

db.parcels.createIndex(
    { "metadata.updatedAt": -1 },
    { name: "updated_at_index" }
);

// Compound indexes for complex queries
db.parcels.createIndex(
    { "status": 1, "metadata.createdAt": -1 },
    { name: "status_created_at_index" }
);

db.parcels.createIndex(
    { "recipient.email": 1, "status": 1 },
    { name: "email_status_index" }
);

// Text index for search functionality
db.parcels.createIndex(
    { 
        "sender.name": "text",
        "recipient.name": "text",
        "item.description": "text"
    },
    { 
        name: "text_search_index",
        weights: {
            "sender.name": 3,
            "recipient.name": 3,
            "item.description": 1
        }
    }
);

// Create indexes for users collection
print('Creating indexes for users collection...');
db.users.createIndex(
    { "email": 1 },
    { unique: true, name: "email_unique_index" }
);

db.users.createIndex(
    { "phone": 1 },
    { name: "phone_index" }
);

// Create indexes for notifications collection
print('Creating indexes for notifications collection...');
db.notifications.createIndex(
    { "parcelId": 1 },
    { name: "parcel_id_index" }
);

db.notifications.createIndex(
    { "recipientEmail": 1 },
    { name: "recipient_email_index" }
);

db.notifications.createIndex(
    { "createdAt": -1 },
    { name: "notification_created_at_index" }
);

db.notifications.createIndex(
    { "status": 1 },
    { name: "notification_status_index" }
);

// Insert sample data for development
print('Inserting sample data...');

// Sample parcel data
const sampleParcel = {
    "_id": "TRK001",
    "sender": {
        "name": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com"
    },
    "recipient": {
        "name": "Jane Smith",
        "phone": "+0987654321",
        "email": "jane@example.com"
    },
    "item": {
        "description": "Electronics package",
        "weight": 2.5,
        "dimensions": "30x20x15 cm"
    },
    "locations": {
        "pickup": {
            "type": "Point",
            "coordinates": [-74.0060, 40.7128],
            "address": "123 Main St, New York, NY"
        },
        "delivery": {
            "type": "Point",
            "coordinates": [-73.9851, 40.7589],
            "address": "456 Broadway, New York, NY"
        }
    },
    "status": "Registered",
    "statusHistory": [
        {
            "status": "Registered",
            "timestamp": new Date(),
            "location": null,
            "notes": "Parcel registered by sender"
        }
    ],
    "locationHistory": [],
    "delivery": {
        "expectedDate": "2024-01-16",
        "actualDate": null,
        "eta": null,
        "distance": 5.2,
        "route": null
    },
    "notifications": {
        "emailSent": false,
        "smsSent": false,
        "lastNotification": null
    },
    "metadata": {
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "createdBy": "admin",
        "tags": ["electronics", "fragile"]
    }
};

// Insert sample parcel
db.parcels.insertOne(sampleParcel);

// Sample user data
const sampleUser = {
    "_id": "user001",
    "name": "Admin User",
    "email": "admin@trackme.com",
    "phone": "+1111111111",
    "role": "admin",
    "createdAt": new Date(),
    "updatedAt": new Date()
};

db.users.insertOne(sampleUser);

print('✅ Database initialization completed successfully!');
print('');
print('📊 Database Statistics:');
print('Collections created: ' + db.getCollectionNames().length);
print('Sample parcel ID: TRK001');
print('Sample user email: admin@trackme.com');
print('');
print('🔗 Access URLs:');
print('Frontend: http://localhost:3000');
print('Backend API: http://localhost:9090');
print('MongoDB Express: http://localhost:8081');
print('MongoDB: mongodb://localhost:27017'); 