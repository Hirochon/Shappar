package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"
)

func TestMiddleware_Recoverer(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name       string
		panicErr   error
		wantStatus int
	}{
		{
			name:       "success",
			panicErr:   assert.AnError,
			wantStatus: http.StatusInternalServerError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			m := newMocks(t)
			middleware := newTestMiddleware(m)

			router := chi.NewRouter()
			router.Use(middleware.Recoverer)
			router.Get("/test/users/user-id", func(w http.ResponseWriter, r *http.Request) {
				panic(http.ErrBodyNotAllowed)
			})

			r := httptest.NewRequest(http.MethodGet, "/test/users/user-id", nil)
			w := httptest.NewRecorder()
			router.ServeHTTP(w, r)

			assert.Equal(t, tt.wantStatus, w.Code)
		})
	}
}

func Test_getUserID(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name string
		path string
		want string
	}{
		{
			name: "no users path",
			path: "/test",
			want: "",
		},
		{
			name: "success",
			path: "/test/users/user-id",
			want: "user-id",
		},
	}
	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			got := getUserID(tt.path)
			assert.Equal(t, tt.want, got)
		})
	}
}
