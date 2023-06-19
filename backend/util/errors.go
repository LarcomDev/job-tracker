package util

import "log"

func ErrMongoConnection(err error) {
	if err != nil {
		log.Fatal("Connection to MongoDB instance failed.")
	}
}

func PrintErr(err error) {
	if err != nil {
		log.Println(err)
	}
}
