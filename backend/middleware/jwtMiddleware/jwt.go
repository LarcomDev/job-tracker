package jwtMiddleware

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

const bearer string = "Bearer "

var wellKnownURL string = os.Getenv("AUTH0-WELL-KNOWN-URL")

func Jwt(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		// Deny if no auth header is provided
		if authHeader == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		token := parseHeader(authHeader)
		valid, err := validateToken(token)

		if err != nil || !valid {
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Println(err.Error())
			return
		}

		// Continue middleware chain if token is valid
		h.ServeHTTP(w, r)
	})
}

func validateToken(tokenString string) (isValid bool, err error) {
	wellKnownResponse, err := parseWellKnownURL()
	if err != nil {
		fmt.Println(err.Error())
		return false, err
	}

	tokenRet, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		keyId := token.Header["kid"].(string)
		jwksURL := wellKnownResponse["jwks_uri"].(string)

		jwksKeys, err := parseJWKS(jwksURL)
		if err != nil {
			return nil, errors.New("error parsing JWKS")
		}

		for _, key := range jwksKeys.Keys {
			if key.Kid == keyId {
				return jwt.ParseRSAPublicKeyFromPEM([]byte("-----BEGIN CERTIFICATE-----\n" + key.X5c[0] + "\n-----END CERTIFICATE-----"))
			}
		}
		return nil, err
	})

	if err != nil {
		return false, err
	}

	tokenIss, err := tokenRet.Claims.GetIssuer()

	if tokenRet.Valid && tokenIss == wellKnownResponse["issuer"].(string) {
		return true, nil
	}
	return false, nil
}

func parseHeader(header string) string {
	return header[len(bearer):]
}

func parseWellKnownURL() (response map[string]any, err error) {
	client := &http.Client{}
	var wellKnownResponse map[string]any

	resp, err := client.Get(wellKnownURL)
	if err != nil {
		fmt.Println(err.Error())
	}

	err = json.NewDecoder(resp.Body).Decode(&wellKnownResponse)
	if err != nil {
		fmt.Println(err.Error())
	}

	return wellKnownResponse, nil
}

func parseJWKS(jwksURL string) (JwksKeys, error) {
	client := &http.Client{}
	var jwks JwksKeys

	resp, err := client.Get(jwksURL)
	if err != nil {
		fmt.Println(err.Error())
	}

	err = json.NewDecoder(resp.Body).Decode(&jwks)
	if err != nil {
		fmt.Println(err.Error())
	}

	return jwks, nil
}
