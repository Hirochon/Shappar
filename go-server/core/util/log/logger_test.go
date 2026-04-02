package log

import (
	"bytes"
	"context"
	"errors"
	"log/slog"
	"testing"

	"github.com/Hirochon/Shappar/core/util/code"
	"github.com/go-chi/render"
	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/stretchr/testify/assert"
)

const testModulePath = "github.com/Hirochon/Shappar/core/util/log"

type testLog struct {
	Time           string            `json:"time"`
	Severity       string            `json:"severity"`
	SourceLocation sourceLocation    `json:"logging.googleapis.com/sourceLocation"`
	Message        string            `json:"message"`
	Labels         map[string]string `json:"logging.googleapis.com/labels"`
	CustomKey      string            `json:"customKey"`
	Error          string            `json:"error"`
	ErrorDetails   errorDetails      `json:"errorDetails"`
}

type sourceLocation struct {
	Function string `json:"function"`
	File     string `json:"file"`
	Line     int    `json:"line"`
}

type errorDetails struct {
	Code       string         `json:"code"`
	Message    string         `json:"message"`
	Attributes map[string]any `json:"attributes"`
	StackTrace string         `json:"stackTrace"`
}

func Test_logger(t *testing.T) {
	var logbuf bytes.Buffer
	logger := NewLogger(slog.New(slog.NewJSONHandler(&logbuf, gcpHandlerOptions(slog.LevelDebug))), LogTypeApp)

	tests := []struct {
		name string
		exec func()
		want testLog
	}{
		{
			name: "DEBUG",
			exec: func() {
				logger.Debug(context.Background(), "test debug", slog.String("customKey", "value"))
			},
			want: testLog{
				Severity: "DEBUG",
				SourceLocation: sourceLocation{
					Function: testModulePath + ".Test_logger.func1",
					Line:     53,
				},
				Message:   "test debug",
				CustomKey: "value",
				Labels:    map[string]string{"logType": "appLog"},
			},
		},
		{
			name: "INFO",
			exec: func() {
				logger.Info(context.Background(), "test info")
			},
			want: testLog{
				Severity: "INFO",
				SourceLocation: sourceLocation{
					Function: testModulePath + ".Test_logger.func2",
					Line:     69,
				},
				Message: "test info",
				Labels:  map[string]string{"logType": "appLog"},
			},
		},
		{
			name: "WARN",
			exec: func() {
				err := code.NewError(code.NotFound, "test warn")
				logger.Warn(context.Background(), err)
			},
			want: testLog{
				Severity: "WARN",
				SourceLocation: sourceLocation{
					Function: testModulePath + ".Test_logger.func3",
					Line:     85,
				},
				Message: "test warn",
				Error:   "code: not_found, message: test warn",
				ErrorDetails: errorDetails{
					Code:    "not_found",
					Message: "test warn",
				},
				Labels: map[string]string{"logType": "appLog"},
			},
		},
		{
			name: "ERROR",
			exec: func() {
				err := code.WrapError(errors.New("test origin error"), code.Internal, "test error")
				logger.Error(context.Background(), err)
			},
			want: testLog{
				Severity: "ERROR",
				SourceLocation: sourceLocation{
					Function: testModulePath + ".Test_logger.func4",
					Line:     106,
				},
				Message: "test error",
				Error:   "code: internal, message: test error, origin: test origin error",
				ErrorDetails: errorDetails{
					Code:    "internal",
					Message: "test error",
				},
				Labels: map[string]string{"logType": "appLog"},
			},
		},
		{
			name: "Log",
			exec: func() {
				logger.Log(context.Background(), slog.LevelDebug, "test log")
			},
			want: testLog{
				Severity: "DEBUG",
				SourceLocation: sourceLocation{
					Function: testModulePath + ".Test_logger.func5",
					Line:     126,
				},
				Message: "test log",
				Labels:  map[string]string{"logType": "appLog"},
			},
		},
		{
			name: "With",
			exec: func() {
				l := logger.With(slog.String("CustomKey", "with"))
				l.Debug(context.Background(), "test with")
			},
			want: testLog{
				Severity: "DEBUG",
				SourceLocation: sourceLocation{
					Function: testModulePath + ".Test_logger.func6",
					Line:     142,
				},
				Message:   "test with",
				CustomKey: "with",
				Labels:    map[string]string{"logType": "appLog"},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.exec()

			got := &testLog{}
			assert.NoError(t, render.DecodeJSON(&logbuf, got))
			if diff := cmp.Diff(tt.want, *got, cmpopts.IgnoreFields(*got, "Time", "SourceLocation.File", "SourceLocation.Line", "ErrorDetails.StackTrace")); diff != "" {
				t.Errorf("unexpected result: %s", diff)
			}
		})
	}
}
