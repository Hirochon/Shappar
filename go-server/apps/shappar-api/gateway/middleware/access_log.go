package middleware

import (
	"bytes"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"time"

	"github.com/Hirochon/Shappar/core/util/log"
	"github.com/Hirochon/Shappar/core/util/trace"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type httpRequest struct {
	RequestMethod string `json:"requestMethod"`
	RequestUrl    string `json:"requestUrl"`
	RequestSize   string `json:"requestSize"`
	Status        int    `json:"status"`
	ResponseSize  string `json:"responseSize"`
	UserAgent     string `json:"userAgent"`
	RemoteIP      string `json:"remoteIp"`
	ServerIP      string `json:"serverIp"`
	Referer       string `json:"referer"`
	Latency       string `json:"latency"`
}

var logger = log.NewLogger(log.New(), log.LogTypeAccess)

func (m *Middleware) AccessLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := trace.StartSpan(r.Context())
		defer func() { trace.EndSpan(ctx, nil) }()

		startTime := time.Now()

		// リクエストボディ読み込み
		reqBodyBuf, _ := io.ReadAll(r.Body)
		// 一度読み切るとそれ以降読めなくなるため、再度詰め直す
		r.Body = io.NopCloser(bytes.NewBuffer(reqBodyBuf))

		// リクエストボディ読み込み
		// レスポンスボディが取得できるようにラップする
		lrw := middleware.NewWrapResponseWriter(w, 1)
		resBodyBuf := &bytes.Buffer{}
		lrw.Tee(resBodyBuf)

		next.ServeHTTP(lrw, r)

		route := chi.RouteContext(ctx).RoutePattern()
		latency := fmt.Sprintf("%.9fs", time.Since(startTime).Seconds())

		l := logger.With(
			slog.Any("httpRequest", &httpRequest{
				RequestMethod: r.Method,
				RequestUrl:    r.RequestURI,
				RequestSize:   fmt.Sprintf("%d", len(reqBodyBuf)),
				ResponseSize:  fmt.Sprintf("%d", len(resBodyBuf.Bytes())),
				UserAgent:     r.UserAgent(),
				RemoteIP:      r.RemoteAddr,
				Referer:       r.Referer(),
				Status:        lrw.Status(),
				Latency:       latency,
			}),
			slog.String("timestamp", startTime.Format("2006-01-02T15:04:05.999999999Z")),
			slog.String("route", route),
		)

		switch {
		case lrw.Status() <= 399:
			l.Info(ctx, "")
		case lrw.Status() >= 400 && lrw.Status() <= 499:
			l.Warn(ctx, nil)
		case lrw.Status() >= 500:
			l.Error(ctx, nil)
		}

	})
}
