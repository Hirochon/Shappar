package middleware

import (
	"testing"
)

type mocks struct{}

func newMocks(t *testing.T) *mocks {
	return &mocks{}
}

func newTestMiddleware(m *mocks) *Middleware {
	return &Middleware{}
}
