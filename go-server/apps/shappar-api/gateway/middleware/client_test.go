package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Hirochon/Shappar/core/util/context"
	"github.com/go-chi/chi/v5"
	cmiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/stretchr/testify/assert"
)

func TestMiddleware_SetClient(t *testing.T) {
	t.Parallel()

	m := newMocks(t)
	middleware := newTestMiddleware(m)
	router := chi.NewRouter()
	router.Use(cmiddleware.RealIP)
	router.Get("/test", func(w http.ResponseWriter, r *http.Request) {
		middleware.SetClient(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			client := context.GetClient(r.Context())
			assert.Equal(t, &context.Client{
				IP:        "111.222.111.222",
				UserAgent: "ua",
			}, client)
			w.WriteHeader(http.StatusOK)
		})).ServeHTTP(w, r)
	})

	r := httptest.NewRequest(http.MethodGet, "/test", nil)
	r.Header.Set("X-Forwarded-For", "111.222.111.222")
	r.Header.Set("User-Agent", "ua")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, r)
}
