package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/db"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/models"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/util"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
	"time"
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

func CreateApplication(w http.ResponseWriter, r *http.Request) {
	var app models.Application
	user := chi.URLParam(r, "username")

	err := json.NewDecoder(r.Body).Decode(&app)
	util.PrintErr(err)

	app.AppId = primitive.NewObjectID()
	app.UserId = user
	app.ApplicationDate = time.Now().UTC()

	//set note date for each note
	for i := range app.Notes {
		app.Notes[i].Date = time.Now().UTC()
	}

	_, err = db.JobsCollection.InsertOne(context.TODO(), app)
	util.PrintErr(err)
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
