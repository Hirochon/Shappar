package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Hirochon/Shappar/core/util/config"
	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestMiddleware_CORS(t *testing.T) {
	tests := []struct {
		name         string
		setup        func(t *testing.T)
		origin       string
		allowOrigin  string
		allowMethods string
		allowHeader  string
		allowMaxAge  string
		wantStatus   int
	}{
		{
			name: "dev",
			setup: func(t *testing.T) {
				t.Setenv("ENV", "development")
			},
			origin:       "http://localhost:1234",
			allowOrigin:  "http://localhost:1234",
			allowMethods: "GET",
			allowHeader:  "Authorization",
			allowMaxAge:  "300",
			wantStatus:   http.StatusOK,
		},
		{
			name: "staging",
			setup: func(t *testing.T) {
				t.Setenv("ENV", "staging")
			},
			origin:       "http://localhost:1234",
			allowOrigin:  "http://localhost:1234",
			allowMethods: "GET",
			allowHeader:  "Authorization",
			allowMaxAge:  "300",
			wantStatus:   http.StatusOK,
		},
		{
			name: "production",
			setup: func(t *testing.T) {
				t.Setenv("ENV", "production")
			},
			origin:       "http://localhost:1234",
			allowOrigin:  "",
			allowMethods: "",
			allowHeader:  "",
			allowMaxAge:  "",
			wantStatus:   http.StatusOK,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setup(t)
			require.NoError(t, config.Reload())
			m := newMocks(t)
			middleware := newTestMiddleware(m)
			router := chi.NewRouter()
			router.Use(middleware.CORS)
			router.Options("/test", func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
			})

			r := httptest.NewRequest(http.MethodOptions, "/test", nil)
			r.Header.Set("Origin", tt.origin)
			r.Header.Set("Access-Control-Request-Method", "GET")
			r.Header.Set("Access-Control-Request-Headers", "Authorization")
			w := httptest.NewRecorder()
			router.ServeHTTP(w, r)

			assert.Equal(t, tt.wantStatus, w.Code)

			gotAllowOrigin := w.Result().Header.Get("Access-Control-Allow-Origin")
			gotAllowMethods := w.Result().Header.Get("Access-Control-Allow-Methods")
			gotAllowHeader := w.Result().Header.Get("Access-Control-Allow-Headers")
			gotAllowMaxAge := w.Result().Header.Get("Access-Control-Max-Age")

			assert.Equal(t, tt.allowOrigin, gotAllowOrigin)
			assert.Equal(t, tt.allowMethods, gotAllowMethods)
			assert.Equal(t, tt.allowHeader, gotAllowHeader)
			assert.Equal(t, tt.allowMaxAge, gotAllowMaxAge)
		})
	}
}
