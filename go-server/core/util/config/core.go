package config

import "github.com/kelseyhightower/envconfig"

var core *coreConfig

type coreConfig struct {
	Env Env `split_words:"true"`
	LogLevel LogLevel `split_words:"true" default:"info"`
	LogFormat LogFormat `split_words:"true" default:"text"`
}

type Env string

const (
	EnvTest Env = "test"
	EnvDevelopment Env = "development"
	EnvProduction Env = "production"
)

type LogLevel string

const (
	LogLevelDebug LogLevel = "debug"
	LogLevelInfo LogLevel = "info"
)

type LogFormat string

const (
	LogFormatText LogFormat = "text"
	LogFormatGCP LogFormat = "gcp"
)

func init() {
	if err := Reload(); err != nil {
		panic(err)
	}
}

func Reload() error {
	core = &coreConfig{}
	return envconfig.Process("", core)
}

func GetEnv() Env {
	return core.Env
}

func GetLogLevel() LogLevel {
	return core.LogLevel
}

func GetLogFormat() LogFormat {
	return core.LogFormat
}
