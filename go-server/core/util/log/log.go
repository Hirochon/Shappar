package log

import (
	"context"
	"log/slog"
	"os"

	"github.com/Hirochon/Shappar/core/util/config"
	ccontext "github.com/Hirochon/Shappar/core/util/context"
	"go.opentelemetry.io/otel/trace"
)

type settingIDHandler struct {
	slog.Handler
}

func New() *slog.Logger {
	level := slog.LevelInfo
	if err := level.UnmarshalText([]byte(config.GetLogLevel())); err != nil {
		slog.Error(err.Error())
	}
	switch config.GetLogFormat() {
	case "gcp":
		return slog.New(&settingIDHandler{slog.NewJSONHandler(os.Stdout, gcpHandlerOptions(level))})
	default:
		return slog.New(&settingIDHandler{slog.NewTextHandler(os.Stdout, textHandlerOptions(level))})
	}
}

func (sh *settingIDHandler) Handle(ctx context.Context, r slog.Record) error {
	if operatorID := ccontext.GetOperatorID(ctx); operatorID != "" {
		r.AddAttrs(slog.String("operatorId", operatorID))
	}
	if s := trace.SpanContextFromContext(ctx); s.IsValid() {
		r.AddAttrs(slog.Any("logging.googleapis.com/trace", s.TraceID()))
		r.AddAttrs(slog.Any("logging.googleapis.com/spanId", s.SpanID()))
		r.AddAttrs(slog.Bool("logging.googleapis.com/trace_sampled", s.TraceFlags().IsSampled()))
	}
	return sh.Handler.Handle(ctx, r)
}

func (h *settingIDHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &settingIDHandler{h.Handler.WithAttrs(attrs)}
}

func (h *settingIDHandler) WithGroup(name string) slog.Handler {
	return &settingIDHandler{h.Handler.WithGroup(name)}
}

func gcpHandlerOptions(level slog.Level) *slog.HandlerOptions {
	return &slog.HandlerOptions{
		AddSource: true,
		Level:     level,
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			switch a.Key {
			case slog.LevelKey:
				a.Key = "severity"
			case slog.MessageKey:
				a.Key = "message"
			case slog.SourceKey:
				a.Key = "logging.googleapis.com/sourceLocation"
			}
			return a
		},
	}
}

func textHandlerOptions(level slog.Level) *slog.HandlerOptions {
	return &slog.HandlerOptions{
		AddSource: true,
		Level:     level,
	}
}
