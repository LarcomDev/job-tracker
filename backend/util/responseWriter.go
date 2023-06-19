package util

import (
	"encoding/json"
	"github.com/damonlarcom/advancedwebscripting/job-tracker/models"
	"net/http"
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
	w.WriteHeader(http.StatusOK)
	w.Write(MarshalResponse(models.Response{Status: http.StatusOK, Message: "No content for requested resource"}))
}
