package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Application struct {
	AppId           primitive.ObjectID `json:"id" bson:"_id"`
	UserId          string             `json:"-" bson:"UserId"`
	Company         string             `json:"company" bson:"Company"`
	Title           string             `json:"title" bson:"Title"`
	Status          string             `json:"status" bson:"Status"`
	Location        string             `json:"location" bson:"Location"`
	Link            string             `json:"link" bson:"Link"`
	ApplicationDate time.Time          `json:"application_date" bson:"ApplicationDate"`
	Skills          []string           `json:"skills,omitempty" bson:"Skills"`
	Notes           []ApplicationNote  `json:"notes,omitempty" bson:"Notes,omitempty"`
}

type ApplicationNote struct {
	Title   string    `json:"title" bson:"Title"`
	Date    time.Time `json:"date" bson:"Date"`
	Content string    `json:"content" bson:"Content"`
}
