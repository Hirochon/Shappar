package log

import (
	"context"
	"log/slog"
	"sync/atomic"

	"github.com/Hirochon/Shappar/core/util/code"
)

var defaultAppLogger atomic.Pointer[Logger]

func init() {
	l := NewLogger(New(), LogTypeApp)
	defaultAppLogger.Store(l)
}

func DefaultAppLogger() *Logger {
	return defaultAppLogger.Load()
}

func Debug(ctx context.Context, msg string, args ...any) {
	DefaultAppLogger().Logger.DebugContext(ctx, msg, args...)
}

func Info(ctx context.Context, msg string, args ...any) {
	DefaultAppLogger().Logger.InfoContext(ctx, msg, args...)
}

func Warn(ctx context.Context, err error, args ...any) {
	// *Logger.Warnを呼び出したくなるところですが、呼び出し階層が増えてしまうと
	// currentCallerHandlerの計算がズレてしまい、呼び出し元ソース情報が変わるため、
	// *Logger.Warnとほとんど同じ処理をしています。
	if err == nil {
		DefaultAppLogger().Logger.WarnContext(ctx, code.GetMessage(err), args...)
		return
	}
	ll := DefaultAppLogger().With(
		slog.String("error", err.Error()),
		slog.Group("errorDetails",
			slog.String("code", string(code.GetCode(err))),
			slog.String("message", code.GetMessage(err)),
			slog.Any("attributes", code.GetAttrs(err)),
			slog.String("stackTrace", code.GetStack(err)),
		),
	)
	ll.Logger.WarnContext(ctx, code.GetMessage(err), args...)
}

func Error(ctx context.Context, err error, args ...any) {
	// *Logger.Errorを呼び出したくなるところですが、呼び出し階層が増えてしまうと
	// currentCallerHandlerの計算がズレてしまい、呼び出し元ソース情報が変わるため、
	// *Logger.Errorとほとんど同じ処理をしています。
	if err == nil {
		DefaultAppLogger().Logger.ErrorContext(ctx, code.GetMessage(err), args...)
		return
	}
	ll := DefaultAppLogger().With(
		slog.String("error", err.Error()),
		slog.Group("errorDetails",
			slog.String("code", string(code.GetCode(err))),
			slog.String("message", code.GetMessage(err)),
			slog.Any("attributes", code.GetAttrs(err)),
			slog.String("stackTrace", code.GetStack(err)),
		),
	)
	ll.Logger.ErrorContext(ctx, code.GetMessage(err), args...)
}

func With(args ...any) *Logger {
	return DefaultAppLogger().With(args...)
}
