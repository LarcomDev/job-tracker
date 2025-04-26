package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/damonlarcom/advancedwebscripting/job-tracker/db"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/models"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/util"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetApplicationsByUser(w http.ResponseWriter, r *http.Request) {
	var apps []models.Application
	user := chi.URLParam(r, "username")

	cur, err := db.JobsCollection.Find(context.TODO(), bson.D{{"UserId", user}})
	util.PrintErr(err)

	defer cur.Close(context.TODO())
	if cur.RemainingBatchLength() == 0 {
		util.ResNoContent(w)
		return
	}
	for cur.Next(context.TODO()) {
		var app models.Application
		err := cur.Decode(&app)
		util.PrintErr(err)

		apps = append(apps, app)
	}

	w.Write(util.MarshalResponse(models.Response{Status: http.StatusOK, Data: apps}))
}

func GetApplicationById(w http.ResponseWriter, r *http.Request) {
	var app models.Application
	appId := chi.URLParam(r, "id")
	id, _ := primitive.ObjectIDFromHex(appId)

	err := db.JobsCollection.FindOne(context.TODO(), bson.D{{"_id", id}}).Decode(&app)
	if err != nil && err == mongo.ErrNoDocuments {
		util.ResNotFound(w)
		return
	}

	w.Write(util.MarshalResponse(models.Response{Status: http.StatusOK, Data: app}))
}

func GetApplications(w http.ResponseWriter, r *http.Request) {
	collection := db.JobsCollection
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		util.ResInternalServerError(w)
		return
	}
	defer cursor.Close(context.Background())

	var applications []models.Application
	if err := cursor.All(context.Background(), &applications); err != nil {
		util.ResInternalServerError(w)
		return
	}

	util.ResOK(w, applications)
}

func GetApplication(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		util.ResBadRequest(w)
		return
	}

	collection := db.JobsCollection
	var application models.Application
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&application)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			util.ResNotFound(w)
		} else {
			util.ResInternalServerError(w)
		}
		return
	}

	util.ResOK(w, application)
}

func CreateApplication(w http.ResponseWriter, r *http.Request) {
	var application models.Application
	if err := json.NewDecoder(r.Body).Decode(&application); err != nil {
		util.ResBadRequest(w)
		return
	}

	// Set default status if not provided
	if application.Status == "" {
		application.Status = "Applied"
	}

	// Insert the application into MongoDB
	collection := db.JobsCollection
	result, err := collection.InsertOne(context.Background(), application)
	if err != nil {
		util.ResInternalServerError(w)
		return
	}

	// Return success response with the inserted ID
	util.ResOK(w, map[string]interface{}{
		"id": result.InsertedID,
	})
}

func UpdateBaseApplication(w http.ResponseWriter, r *http.Request) {
	var app models.Application
	appId := chi.URLParam(r, "id")
	id, _ := primitive.ObjectIDFromHex(appId)

	err := json.NewDecoder(r.Body).Decode(&app)
	util.PrintErr(err)

	results, err := db.JobsCollection.UpdateOne(context.TODO(), bson.D{{"_id", id}}, bson.D{{"$set", bson.D{
		{"Company", app.Company},
		{"Title", app.Title},
		{"Status", app.Status},
		{"Location", app.Location},
		{"Link", app.Link},
		{"Skills", app.Skills},
	}}})
	util.PrintErr(err)
	if results.MatchedCount == 0 {
		util.ResNotFound(w)
	}

	w.Write(util.MarshalResponse(models.Response{Status: http.StatusOK, Message: "Application successfully updated"}))
}

func AddApplicationNote(w http.ResponseWriter, r *http.Request) {
	var notes []models.ApplicationNote
	appId := chi.URLParam(r, "id")
	id, _ := primitive.ObjectIDFromHex(appId)

	err := json.NewDecoder(r.Body).Decode(&notes)
	util.PrintErr(err)

	fmt.Println(notes)
	for i := range notes {
		notes[i].Date = time.Now().UTC()
	}

	results, err := db.JobsCollection.UpdateOne(context.TODO(), bson.D{{"_id", id}},
		bson.D{{"$push", bson.D{{"Notes", bson.D{{"$each", notes}}}}}})
	util.PrintErr(err)

	if results.MatchedCount == 0 {
		util.ResNotFound(w)
		return
	}
	w.Write(util.MarshalResponse(models.Response{Status: http.StatusOK, Message: "Note(s) added to application"}))
}

func UpdateApplication(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		util.ResBadRequest(w)
		return
	}

	var application models.Application
	if err := json.NewDecoder(r.Body).Decode(&application); err != nil {
		util.ResBadRequest(w)
		return
	}

	collection := db.JobsCollection
	result, err := collection.ReplaceOne(context.Background(), bson.M{"_id": objectID}, application)
	if err != nil {
		util.ResInternalServerError(w)
		return
	}

	if result.MatchedCount == 0 {
		util.ResNotFound(w)
		return
	}

	application.AppId = objectID
	util.ResOK(w, application)
}

func DeleteApplication(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		util.ResBadRequest(w)
		return
	}

	collection := db.JobsCollection
	result, err := collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		util.ResInternalServerError(w)
		return
	}

	if result.DeletedCount == 0 {
		util.ResNotFound(w)
		return
	}

	util.ResOK(w, map[string]string{"message": "Application deleted successfully"})
}

func UpdateApplicationStatus(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		util.ResBadRequest(w)
		return
	}

	var statusUpdate struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&statusUpdate); err != nil {
		util.ResBadRequest(w)
		return
	}

	collection := db.JobsCollection
	result, err := collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{"status": statusUpdate.Status}},
	)
	if err != nil {
		util.ResInternalServerError(w)
		return
	}

	if result.MatchedCount == 0 {
		util.ResNotFound(w)
		return
	}

	util.ResOK(w, map[string]string{"message": "Application status updated successfully"})
}

func AddNote(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		util.ResBadRequest(w)
		return
	}

	var note struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&note); err != nil {
		util.ResBadRequest(w)
		return
	}

	collection := db.JobsCollection
	result, err := collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$push": bson.M{"notes": note.Content}},
	)
	if err != nil {
		util.ResInternalServerError(w)
		return
	}

	if result.MatchedCount == 0 {
		util.ResNotFound(w)
		return
	}

	util.ResOK(w, map[string]string{"message": "Note added successfully"})
}
