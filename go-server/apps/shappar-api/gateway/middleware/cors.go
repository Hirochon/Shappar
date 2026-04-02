package middleware

import (
	"net/http"

	"github.com/Hirochon/Shappar/core/util/config"
	"github.com/go-chi/cors"
)

func (m *Middleware) CORS(next http.Handler) http.Handler {
	if config.GetEnv() == config.EnvProduction {
		return next
	}
	return cors.Handler(cors.Options{
		AllowedOrigins: []string{"http://localhost:*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Authorization", "Content-Type"},
		MaxAge:         300,
	})(next)
}
