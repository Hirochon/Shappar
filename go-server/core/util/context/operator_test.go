package context

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestOperator(t *testing.T) {
	t.Parallel()

	ctx := context.Background()

	// オペレーターIDが設定されていないこと
	operatorID := GetOperatorID(ctx)
	assert.Equal(t, "", operatorID)

	// オペレーターIDが設定されていること
	ctx = SetOperatorID(ctx, "operator1")
	operatorID = GetOperatorID(ctx)
	assert.Equal(t, "operator1", operatorID)
}
