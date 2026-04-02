package config

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetEnv(t *testing.T) {
	prevEnv := os.Getenv("ENV")
	defer func() {
		require.NoError(t, os.Setenv("ENV", prevEnv))
		require.NoError(t, Reload())
	}()

	tests := []struct {
		name  string
		setup func(t *testing.T)
		want  Env
	}{
		{
			name: "development",
			setup: func(t *testing.T) {
				require.NoError(t, os.Setenv("ENV", "development"))
			},
			want: "development",
		},
		{
			name: "unset",
			setup: func(t *testing.T) {
				require.NoError(t, os.Unsetenv("ENV"))
			},
			want: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setup(t)
			require.NoError(t, Reload())

			got := GetEnv()
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestGetLogLevel(t *testing.T) {
	prevLogLevel := os.Getenv("LOG_LEVEL")
	defer func() {
		require.NoError(t, os.Setenv("LOG_LEVEL", prevLogLevel))
		require.NoError(t, Reload())
	}()

	tests := []struct {
		name  string
		setup func(t *testing.T)
		want  LogLevel
	}{
		{
			name: "debug",
			setup: func(t *testing.T) {
				require.NoError(t, os.Setenv("LOG_LEVEL", "debug"))
			},
			want: "debug",
		},
		{
			name: "info",
			setup: func(t *testing.T) {
				require.NoError(t, os.Setenv("LOG_LEVEL", "info"))
			},
			want: "info",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setup(t)
			require.NoError(t, Reload())

			got := GetLogLevel()
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestGetLogFormat(t *testing.T) {
	prevLogFormat := os.Getenv("LOG_FORMAT")
	defer func() {
		require.NoError(t, os.Setenv("LOG_FORMAT", prevLogFormat))
		require.NoError(t, Reload())
	}()

	tests := []struct {
		name  string
		setup func(t *testing.T)
		want  LogFormat
	}{
		{
			name: "text",
			setup: func(t *testing.T) {
				require.NoError(t, os.Setenv("LOG_FORMAT", "text"))
			},
			want: "text",
		},
		{
			name: "gcp",
			setup: func(t *testing.T) {
				require.NoError(t, os.Setenv("LOG_FORMAT", "gcp"))
			},
			want: "gcp",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setup(t)
			require.NoError(t, Reload())

			got := GetLogFormat()
			assert.Equal(t, tt.want, got)
		})
	}
}
