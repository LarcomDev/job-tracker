package middleware

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jwt"
)

type JWT func(http.Handler) http.Handler

func JWTWithConfig(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get environment variables
		auth0Domain := os.Getenv("AUTH0_DOMAIN")
		auth0Audience := os.Getenv("AUTH0_AUDIENCE")

		if auth0Domain == "" || auth0Audience == "" {
			log.Printf("Auth0 configuration missing:")
			log.Printf("AUTH0_DOMAIN: '%s'", auth0Domain)
			log.Printf("AUTH0_AUDIENCE: '%s'", auth0Audience)
			http.Error(w, "Server configuration error", http.StatusInternalServerError)
			return
		}

		// Get the token from the Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header is required", http.StatusUnauthorized)
			return
		}

		// Check if the token is in the correct format
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Authorization header format must be Bearer {token}", http.StatusUnauthorized)
			return
		}

		token := parts[1]

		// Get the JWKS from Auth0
		domain := strings.TrimRight(auth0Domain, "/")
		jwksURL := fmt.Sprintf("https://%s/.well-known/jwks.json", domain)
		log.Printf("Auth0 Domain: %s", domain)
		log.Printf("Auth0 Audience: %s", auth0Audience)
		log.Printf("Fetching JWKS from: %s", jwksURL)

		// Create a custom HTTP client with proper SSL configuration and timeouts
		tr := &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: false,
			},
			ResponseHeaderTimeout: 5 * time.Second,
			IdleConnTimeout:       5 * time.Second,
		}
		client := &http.Client{
			Transport: tr,
			Timeout:   5 * time.Second,
		}

		// Create a context with timeout for JWKS fetch
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// Fetch JWKS with custom client
		keySet, err := jwk.Fetch(ctx, jwksURL, jwk.WithHTTPClient(client))
		if err != nil {
			log.Printf("Failed to fetch JWKS: %v", err)
			log.Printf("Full error details: %+v", err)
			http.Error(w, "Failed to fetch JWKS", http.StatusInternalServerError)
			return
		}

		// Create a new context for token verification
		verifyCtx, verifyCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer verifyCancel()

		// Parse and verify the token
		issuer := fmt.Sprintf("https://%s/", domain)
		log.Printf("Verifying token with issuer: %s", issuer)

		parsedToken, err := jwt.ParseString(token,
			jwt.WithKeySet(keySet),
			jwt.WithValidate(true),
			jwt.WithAudience(auth0Audience),
			jwt.WithIssuer(issuer),
			jwt.WithContext(verifyCtx),
		)
		if err != nil {
			log.Printf("Token validation failed: %v", err)
			log.Printf("Full validation error: %+v", err)
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Add the token claims to the request context
		claims, err := json.Marshal(parsedToken)
		if err != nil {
			log.Printf("Failed to marshal token claims: %v", err)
			http.Error(w, "Failed to parse token claims", http.StatusInternalServerError)
			return
		}

		ctx = context.WithValue(r.Context(), "token", string(claims))
		h.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetTokenClaims returns the token claims from the request context
func GetTokenClaims(r *http.Request) (map[string]interface{}, error) {
	tokenStr := r.Context().Value("token").(string)
	var claims map[string]interface{}
	err := json.Unmarshal([]byte(tokenStr), &claims)
	if err != nil {
		return nil, err
	}
	return claims, nil
}
