package middleware

import (
	"context"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/db"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/models"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

type BasicAuth func(http.Handler) http.Handler

func Basic(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//return 401 if no auth is provided
		email, password, ok := r.BasicAuth()
		if !ok || !verifyUser(email, password) {
			authFailed(w)
			return
		}

		h.ServeHTTP(w, r)
	})
}

func authFailed(w http.ResponseWriter) {
	w.WriteHeader(http.StatusUnauthorized)
}

func verifyUser(username, password string) bool {
	var foundUser models.User

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := db.UserCollection.FindOne(ctx, bson.D{{"Username", username}}).Decode(&foundUser)
	passwordErr := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(password))
	if err != nil || passwordErr != nil {
		return false
	}

	return true
}
