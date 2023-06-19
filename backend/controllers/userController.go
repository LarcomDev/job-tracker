package controllers

import (
	"context"
	"encoding/json"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/db"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/models"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/util"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

func GetUserByUsername(w http.ResponseWriter, r *http.Request) {
	var user models.User
	username := chi.URLParam(r, "username")

	err := db.UserCollection.FindOne(context.TODO(), bson.D{{"Username", username}}).Decode(&user)
	if err != nil && err == mongo.ErrNoDocuments {
		util.ResNotFound(w)
		return
	}

	w.Write(util.MarshalResponse(models.Response{Status: http.StatusOK, Data: struct {
		Username         string `json:"username"`
		RegistrationDate string `json:"registration_date"`
	}{Username: user.Username, RegistrationDate: user.RegistrationDate}}))
}

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	user.Id = primitive.NewObjectID()
	user.RegistrationDate = time.Now().Format("01/02/2006")
	util.PrintErr(err)

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPass)
	util.PrintErr(err)

	if len(user.Username) == 0 || len(user.Password) == 0 {
		util.ResMissingFields(w)
		return
	}

	//checks if user already exists with specified username
	count, err := db.UserCollection.CountDocuments(context.TODO(), bson.D{{"Username", user.Username}})
	if count > 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(util.MarshalResponse(models.Response{Status: http.StatusBadRequest, Message: "A user with this username already exists"}))
		return
	}
	_, err = db.UserCollection.InsertOne(context.TODO(), user)
	util.PrintErr(err)

	w.WriteHeader(http.StatusCreated)
}

func UpdateUserPassword(w http.ResponseWriter, r *http.Request) {
	var user models.User
	username := chi.URLParam(r, "username")

	//decode body into user struct
	err := json.NewDecoder(r.Body).Decode(&user)
	util.PrintErr(err)

	//hash password
	hashPass, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	update := bson.D{{"$set", bson.D{{"Password", string(hashPass)}}}}

	//update user in mongo collection
	result, err := db.UserCollection.UpdateOne(context.TODO(), bson.D{{"Username", username}}, update)

	//check if any user was matched, defaults to status 200 if user was updated
	if result.MatchedCount == 0 {
		util.ResNotFound(w)
		return
	}
}
