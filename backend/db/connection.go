package db

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	mongoConnection *mongo.Client

	JobsCollection *mongo.Collection
	UserCollection *mongo.Collection
)

// Connect establishes a connection with mongo
func Connect() {
	// Get MongoDB URL from environment variable, default to localhost if not set
	mongoURL := os.Getenv("MONGODB_URL")
	if mongoURL == "" {
		mongoURL = "mongodb://localhost:27017"
	}
	log.Printf("Connecting to MongoDB at: %s", mongoURL)

	// Create client options
	clientOptions := options.Client().ApplyURI(mongoURL)

	// Connect to MongoDB
	var err error
	mongoConnection, err = mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Check the connection
	err = mongoConnection.Ping(context.Background(), nil)
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	log.Println("Successfully connected to MongoDB!")

	db := mongoConnection.Database("tracker")
	JobsCollection = db.Collection("jobs")
	UserCollection = db.Collection("user")
}
