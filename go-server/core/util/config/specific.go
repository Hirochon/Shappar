package config

import (
	"github.com/Hirochon/Shappar/core/util/code"
	"github.com/kelseyhightower/envconfig"
	"github.com/samber/do"
)

type HTTP struct {
	Port int `split_words:"true" default:"8080"`
}

func NewHTTP(i *do.Injector) (*HTTP, error) {
	conf := &HTTP{}
	err := envconfig.Process("HTTP", conf)
	if err != nil {
		return nil, code.WrapError(err, code.Internal, "failed to process HTTP config")
	}
	return conf, nil
}
