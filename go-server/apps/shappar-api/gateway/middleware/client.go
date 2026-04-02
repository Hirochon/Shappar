package middleware

import (
	"net/http"

	"github.com/Hirochon/Shappar/core/util/context"
	"github.com/Hirochon/Shappar/core/util/trace"
)

func (m *Middleware) SetClient(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := trace.StartSpan(r.Context())
		defer func() { trace.EndSpan(ctx, nil) }()

		ctx = context.SetClient(ctx, &context.Client{
			IP:        r.RemoteAddr,
			UserAgent: r.UserAgent(),
		})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
