package main

import (
	"fmt"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/controllers"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/db"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"log"
	"net/http"
)

func main() {
	r := chi.NewRouter()
	r.Use(cors.AllowAll().Handler)

	/*
	*	ROUTES
	 */

	//Unauthed Routes
	r.Post("/user/register", controllers.RegisterUser)

	//Authed Routes
	r.Group(func(r chi.Router) {
		r.Use(middleware.Basic)

		//Applications Endpoints
		r.Get("/apps/{username}", controllers.GetApplicationsByUser)
		r.Get("/apps/id/{id}", controllers.GetApplicationById)
		r.Post("/apps/{username}", controllers.CreateApplication)
		r.Put("/apps/{id}", controllers.UpdateBaseApplication)
		r.Put("/apps/{id}/notes", controllers.AddApplicationNote)

		//User Endpoints
		r.Get("/user/{username}", controllers.GetUserByUsername)
		r.Put("/user/{username}/update", controllers.UpdateUserPassword)
	})

	//establish connection with mongo
	db.Connect()

	fmt.Println("<<<Running Job Tracker>>>")
	log.Fatal(http.ListenAndServe(":8080", r))
}
