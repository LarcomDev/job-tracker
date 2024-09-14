package jwtMiddleware

import "net/http"

const bearer string = "Bearer "
const wellKnownURL string = "https://dev-jl4brqjuvbkbm47r.us.auth0.com/.well-known/openid-configuration"

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
			return
		}

		// Continue middleware chain if token is valid
		h.ServeHTTP(w, r)
	})
}

func validateToken(token string) (isValid bool, err error) {

	return true, nil
}

func parseHeader(header string) string {
	return header[len(bearer):]
}
