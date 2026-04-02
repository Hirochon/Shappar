package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Hirochon/Shappar/apps/shappar-api/gateway/oas"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/riandyrn/otelchi"
)

func newServer(injected *injected) *http.Server {
	r := chi.NewRouter()
	r.Use(injected.middleware.Recoverer)
	r.Use(middleware.Timeout(30 * time.Second))
	r.Use(middleware.RealIP)
	r.Use(injected.middleware.CORS)
	r.Use(otelchi.Middleware("shappar-api", otelchi.WithChiRoutes(r),
		otelchi.WithFilter(func(req *http.Request) bool {
			if req.URL.Path == "/health" {
				return false
			}
			return true
		})))
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	h := oas.HandlerWithOptions(injected.handler, oas.ChiServerOptions{
		BaseURL:    "/v1",
		BaseRouter: r,
		Middlewares: []oas.MiddlewareFunc{
			injected.middleware.AccessLogger,
			injected.middleware.SetClient,
		},
	})

	return &http.Server{
		Addr:    fmt.Sprintf(":%d", injected.httpConf.Port),
		Handler: h,
	}
}
