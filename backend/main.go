package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/damonlarcom/advancedwebscripting/job-tracker/controllers"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/db"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Verify Auth0 configuration
	auth0Domain := os.Getenv("AUTH0_DOMAIN")
	auth0Audience := os.Getenv("AUTH0_AUDIENCE")

	if auth0Domain == "" || auth0Audience == "" {
		log.Fatal("Auth0 configuration is missing. Please check your .env file")
	}

	log.Printf("Auth0 Domain: %s", auth0Domain)
	log.Printf("Auth0 Audience: %s", auth0Audience)

	r := chi.NewRouter()
	r.Use(cors.AllowAll().Handler)

	/*
	*	ROUTES
	 */

	//Unauthed Routes
	r.Post("/user/register", controllers.RegisterUser)

	//Authed Routes
	r.Group(func(r chi.Router) {
		r.Use(middleware.JWTWithConfig)

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
