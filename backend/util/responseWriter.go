package util

import (
	"encoding/json"
	"net/http"

	"github.com/damonlarcom/advancedwebscripting/job-tracker/models"
)

func MarshalResponse(response models.Response) []byte {
	responseBytes, _ := json.MarshalIndent(response, "", "    ")
	return responseBytes
}

func ResNotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	w.Write(MarshalResponse(models.Response{Status: http.StatusNotFound, Message: "User or Resource was not found"}))
}

func ResMissingFields(w http.ResponseWriter) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write(MarshalResponse(models.Response{Status: http.StatusBadRequest, Message: "Required fields are empty"}))
}

func ResNoContent(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNoContent)
	w.Write(MarshalResponse(models.Response{Status: http.StatusNoContent, Message: "No content for requested resource"}))
}

func ResBadRequest(w http.ResponseWriter) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write(MarshalResponse(models.Response{Status: http.StatusBadRequest, Message: "Bad Request"}))
}

func ResInternalServerError(w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write(MarshalResponse(models.Response{Status: http.StatusInternalServerError, Message: "Internal Server Error"}))
}

func ResUnauthorized(w http.ResponseWriter) {
	w.WriteHeader(http.StatusUnauthorized)
	w.Write(MarshalResponse(models.Response{Status: http.StatusUnauthorized, Message: "Unauthorized"}))
}

func ResOK(w http.ResponseWriter, data interface{}) {
	w.WriteHeader(http.StatusOK)
	w.Write(MarshalResponse(models.Response{Status: http.StatusOK, Message: "OK", Data: data}))
}
