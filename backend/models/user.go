package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id               primitive.ObjectID `json:"-" bson:"_id"`
	Username         string             `json:"username" bson:"Username"`
	Password         string             `json:"password" bson:"Password"`
	RegistrationDate string             `json:"registration_date" bson:"RegistrationDate"`
}
