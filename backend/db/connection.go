package db

import (
	"context"

	"github.com/damonlarcom/advancedwebscripting/job-tracker/util"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	mongoConnection *mongo.Client

	JobsCollection *mongo.Collection
	UserCollection *mongo.Collection
)

const url = "mongodb://localhost:27017"

// Connect establishes a connection with mongo
func Connect() {
	var err error
	mongoConnection, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(url))
	util.ErrMongoConnection(err)

	db := mongoConnection.Database("tracker")
	JobsCollection = db.Collection("jobs")
	UserCollection = db.Collection("user")
}
