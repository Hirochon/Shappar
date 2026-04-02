package log

import (
	"context"
	"log/slog"
	"runtime"

	"github.com/Hirochon/Shappar/core/util/code"
)

type Logger struct {
	*slog.Logger
}

type LogType string

const (
	LogTypeApp    LogType = "appLog"
	LogTypeAccess LogType = "accessLog"
)

func NewLogger(sl *slog.Logger, logType LogType) *Logger {
	l := &Logger{
		Logger: slog.New(&currentCallerHandler{sl.Handler()}),
	}
	return l.With(slog.Group("logging.googleapis.com/labels", slog.String("logType", string(logType))))
}

func (l *Logger) Debug(ctx context.Context, msg string, args ...any) {
	l.Logger.DebugContext(ctx, msg, args...)
}

func (l *Logger) Info(ctx context.Context, msg string, args ...any) {
	l.Logger.InfoContext(ctx, msg, args...)
}

func (l *Logger) Warn(ctx context.Context, err error, args ...any) {
	if err == nil {
		l.Logger.WarnContext(ctx, code.GetMessage(err), args...)
		return
	}
	args = append(args,
		slog.String("error", err.Error()),
		slog.Group("errorDetails",
			slog.String("code", string(code.GetCode(err))),
			slog.String("message", code.GetMessage(err)),
			slog.Any("attributes", code.GetAttrs(err)),
			slog.String("stackTrace", code.GetStack(err)),
		))
	l.Logger.WarnContext(ctx, code.GetMessage(err), args...)
}

func (l *Logger) Error(ctx context.Context, err error, args ...any) {
	if err == nil {
		l.Logger.ErrorContext(ctx, code.GetMessage(err), args...)
		return
	}
	args = append(args,
		slog.String("error", err.Error()),
		slog.Group("errorDetails",
			slog.String("code", string(code.GetCode(err))),
			slog.String("message", code.GetMessage(err)),
			slog.Any("attributes", code.GetAttrs(err)),
			slog.String("stackTrace", code.GetStack(err)),
		))
	l.Logger.ErrorContext(ctx, code.GetMessage(err), args...)
}

func (l *Logger) Log(ctx context.Context, level slog.Level, msg string, args ...any) {
	l.Logger.Log(ctx, level, msg, args...)
}

func (l *Logger) With(args ...any) *Logger {
	c := l.clone()
	c.Logger = c.Logger.With(args...)
	return c
}

func (l *Logger) clone() *Logger {
	c := *l
	return &c
}

type currentCallerHandler struct {
	slog.Handler
}

func (h *currentCallerHandler) Handle(ctx context.Context, r slog.Record) error {
	var pc uintptr
	var pcs [1]uintptr
	// skip [runtime.Callers, this function, slog.log, slog.log's caller, slog.function's caller]
	runtime.Callers(5, pcs[:])
	pc = pcs[0]
	r.PC = pc
	return h.Handler.Handle(ctx, r)
}

func (h *currentCallerHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &currentCallerHandler{Handler: h.Handler.WithAttrs(attrs)}
}

func (h *currentCallerHandler) WithGroup(name string) slog.Handler {
	return &currentCallerHandler{Handler: h.Handler.WithGroup(name)}
}
