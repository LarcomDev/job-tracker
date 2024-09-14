package jwtMiddleware

type JwksKeys struct {
	Keys []JwksKey `json:"keys"`
}

type JwksKey struct {
	Kty string   `json:"kty"`
	Use string   `json:"use"`
	N   string   `json:"n"`
	E   string   `json:"e"`
	Kid string   `json:"kid"`
	X5t string   `json:"x5t"`
	X5c []string `json:"x5c"`
	Alg string   `json:"alg"`
}
