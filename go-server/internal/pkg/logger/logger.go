package logger

import (
	"time"

	"github.com/go-logr/logr"
	"github.com/go-logr/zapr"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// New はロガーを生成する
func New() (*logr.Logger, error) {
	config := zap.Config{
		Level:             zap.NewAtomicLevelAt(zap.InfoLevel),
		Development:       false,
		Encoding:          "json",
		DisableStacktrace: true,
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:     "timestamp",
			LevelKey:    "level",
			NameKey:     "logger",
			MessageKey:  "message",
			CallerKey:   "caller",
			LineEnding:  zapcore.DefaultLineEnding,
			EncodeLevel: zapcore.LowercaseLevelEncoder,
			// time.Time が日本時刻ではないので、日本時刻且つ人が読める形式に変換する
			EncodeTime: func(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
				enc.AppendString(t.In(time.FixedZone("Asia/Tokyo", 9*60*60)).Format(time.RFC3339Nano))
			},
			EncodeDuration: zapcore.SecondsDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}

	l, err := config.Build()
	if err != nil {
		return nil, err
	}

	zl := zapr.NewLogger(l)

	return &zl, nil
}
