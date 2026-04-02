package trace

import (
	"context"
	"runtime"
	"strings"

	"go.opentelemetry.io/otel"
	ottrace "go.opentelemetry.io/otel/trace"
)

const otelTracerName = "shappar"

func StartSpan(ctx context.Context) context.Context {
	ctx, _ = otel.GetTracerProvider().Tracer(otelTracerName).Start(ctx, funcName())
	return ctx
}

func EndSpan(ctx context.Context, err error) {
	span := ottrace.SpanFromContext(ctx)
	if err != nil {
		span.RecordError(err)
	}
	span.End()
}

func funcName() string {
	// 呼び出し元情報を取得
	pc, _, _, ok := runtime.Caller(2)
	if !ok {
		return ""
	}

	// 関数名を取得
	fn := runtime.FuncForPC(pc)

	trimPrefix := "github.com/Hirochon/Shappar/"
	if strings.HasPrefix(fn.Name(), trimPrefix) {
		return strings.TrimPrefix(fn.Name(), trimPrefix)
	}
	return fn.Name()
}
