package middleware

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/Hirochon/Shappar/core/util/config"
	"github.com/Hirochon/Shappar/core/util/log"
	"github.com/google/go-cmp/cmp"

	"github.com/go-chi/chi/v5"
	cmiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/render"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/stretchr/testify/assert"
)

type testLog struct {
	Time           string            `json:"time"`
	Severity       string            `json:"severity"`
	SourceLocation sourceLocation    `json:"logging.googleapis.com/sourceLocation"`
	Labels         map[string]string `json:"logging.googleapis.com/labels"`
	HttpRequest    httpRequest       `json:"httpRequest"`
	Route          string            `json:"route"`
	TenantID       string            `json:"tenantId"`
}

type sourceLocation struct {
	Function string `json:"function"`
	File     string `json:"file"`
	Message  string `json:"message"`
}

func extractStdout(t *testing.T, fnc func(w http.ResponseWriter, r *http.Request), rw http.ResponseWriter, rr *http.Request) *bytes.Buffer {
	t.Helper()

	orgStdout := os.Stdout
	defer func() {
		os.Stdout = orgStdout
	}()
	r, w, _ := os.Pipe()
	os.Stdout = w
	logger = log.NewLogger(log.New(), log.LogTypeAccess)

	fnc(rw, rr)

	w.Close()

	var buf bytes.Buffer
	if _, err := buf.ReadFrom(r); err != nil {
		t.Fatalf("failed to read buf: %v", err)
	}
	return &buf
}

func TestMiddleware_AccessLogger(t *testing.T) {
	t.Setenv("LOG_FORMAT", string(config.LogFormatGCP))
	config.Reload()

	tests := []struct {
		name       string
		statusCode int
		want       testLog
	}{
		{
			name:       "200 OK",
			statusCode: http.StatusOK,
			want: testLog{
				Severity: "INFO",
				Labels:   map[string]string{"logType": "accessLog"},
				HttpRequest: httpRequest{
					RequestMethod: "GET",
					RequestUrl:    "http://localhost/test/1?p=1",
					RequestSize:   "13",
					ResponseSize:  "11",
					RemoteIP:      "202.32.2.197",
					UserAgent:     "user-agent",
					Referer:       "http://sample.com/sample?p=2",
					Status:        200,
				},
				Route: "/test/{testId}",
			},
		},
		{
			name:       "404 Not Found",
			statusCode: http.StatusNotFound,
			want: testLog{
				Severity: "WARN",
				Labels:   map[string]string{"logType": "accessLog"},
				HttpRequest: httpRequest{
					RequestMethod: "GET",
					RequestUrl:    "http://localhost/test/1?p=1",
					RequestSize:   "13",
					ResponseSize:  "11",
					RemoteIP:      "202.32.2.197",
					UserAgent:     "user-agent",
					Referer:       "http://sample.com/sample?p=2",
					Status:        404,
				},
				Route: "/test/{testId}",
			},
		},
		{
			name:       "500 Internal Server Error",
			statusCode: http.StatusInternalServerError,
			want: testLog{
				Severity: "ERROR",
				Labels:   map[string]string{"logType": "accessLog"},
				HttpRequest: httpRequest{
					RequestMethod: "GET",
					RequestUrl:    "http://localhost/test/1?p=1",
					RequestSize:   "13",
					ResponseSize:  "11",
					RemoteIP:      "202.32.2.197",
					UserAgent:     "user-agent",
					Referer:       "http://sample.com/sample?p=2",
					Status:        500,
				},
				Route: "/test/{testId}",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			m := newMocks(t)

			middleware := newTestMiddleware(m)
			router := chi.NewRouter()
			router.Use(cmiddleware.RealIP)
			router.Get("/test/{testId}", func(w http.ResponseWriter, r *http.Request) {
				middleware.AccessLogger(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					w.WriteHeader(tt.statusCode)
					io.WriteString(w, "response ok")
				})).ServeHTTP(w, r)
			})
			req := bytes.NewBufferString("Hello!request")
			r := httptest.NewRequest(http.MethodGet, "http://localhost/test/1?p=1", req)

			// ヘッダーのセット
			r.Header.Set("User-Agent", "user-agent")
			r.Header.Set("Referer", "http://sample.com/sample?p=2")
			r.Header.Set("X-Forwarded-For", "202.32.2.197, 34.107.251.243")

			w := httptest.NewRecorder()
			got := &testLog{}
			assert.NoError(t, render.DecodeJSON(extractStdout(t, router.ServeHTTP, w, r), got))

			if diff := cmp.Diff(tt.want, *got, cmpopts.IgnoreFields(*got, "Time", "HttpRequest", "SourceLocation")); diff != "" {
				t.Errorf("unexpected result: %s", diff)
			}
			if diff := cmp.Diff(tt.want.HttpRequest, got.HttpRequest, cmpopts.IgnoreFields(got.HttpRequest, "ServerIP", "Latency")); diff != "" {
				t.Errorf("unexpected httpRequest result: %s", diff)
			}
		})
	}
}
