package config

import "github.com/samber/do"

func InjectForShapparAPI(i *do.Injector) {
	do.Provide(i, NewHTTP)
}
