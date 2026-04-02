package main

import (
	"os"
	"testing"

	"github.com/Hirochon/Shappar/core/util/config"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestInject(t *testing.T) {
	os.Setenv("ENV", "test")
	require.NoError(t, config.Reload())

	defer func() {
		os.Unsetenv("ENV")
		require.NoError(t, config.Reload())
	}()

	assert.NotPanics(t, func() {
		injected := inject()
		assert.NoError(t, injected.shutdown())
	})
}
