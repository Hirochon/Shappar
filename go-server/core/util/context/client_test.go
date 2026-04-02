package context

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestClient(t *testing.T) {
	t.Parallel()

	ctx := context.Background()

	// クライアント情報が設定されていないこと
	got := GetClient(ctx)
	assert.Nil(t, got)

	// クライアント情報を設定できること
	cli := &Client{
		IP:        "ip",
		UserAgent: "ua",
	}
	ctx = SetClient(ctx, cli)
	got = GetClient(ctx)
	assert.Equal(t, cli, got)
}
