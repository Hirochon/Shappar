package middleware

import (
	"github.com/samber/do"
)

type Middleware struct{}

func New(i *do.Injector) (*Middleware, error) {
	return &Middleware{}, nil
}
