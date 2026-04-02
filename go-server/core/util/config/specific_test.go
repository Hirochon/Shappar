package config

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewHTTP(t *testing.T) {
	t.Parallel()

	tests := []struct {
		setup func(t *testing.T)
		want  *HTTP
	}{
		{
			setup: func(t *testing.T) {
				require.NoError(t, os.Setenv("HTTP_PORT", "8081"))
			},
			want: &HTTP{
				Port: 8081,
			},
		},
		{
			setup: func(t *testing.T) {
				require.NoError(t, os.Unsetenv("HTTP_PORT"))
			},
			want: &HTTP{
				Port: 8080,
			},
		},
	}

	for _, tt := range tests {
		t.Run("", func(t *testing.T) {
			tt.setup(t)

			got, err := NewHTTP(nil)
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
