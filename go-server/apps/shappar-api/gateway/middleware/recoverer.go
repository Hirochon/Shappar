package middleware

import (
	"log/slog"
	"net/http"
	"regexp"

	"github.com/Hirochon/Shappar/core/util/code"
	"github.com/Hirochon/Shappar/core/util/log"
)

var re = regexp.MustCompile(`/users/([^/]+)`)

func (m *Middleware) Recoverer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rvr := recover(); rvr != nil {
				if rvr == http.ErrAbortHandler {
					// abortエラーは接続を中止しクライアントにエラーを伝えるため、
					// recoverはしない
					// https://github.com/go-chi/chi/pull/624
					panic(rvr)
				}

				log.Error(r.Context(), code.NewError(code.Internal, "panic has occurred"),
					slog.Any("recoverResponse", rvr),
					slog.String("path", r.RequestURI),
					slog.String("userId", getUserID(r.RequestURI)),
				)

				if r.Header.Get("Connection") != "Upgrade" {
					w.WriteHeader(http.StatusInternalServerError)
				}
			}
		}()

		next.ServeHTTP(w, r)
	})
}

func getUserID(path string) string {
	matches := re.FindStringSubmatch(path)
	if len(matches) == 0 {
		return ""
	}
	return matches[1]
}
