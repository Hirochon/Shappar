package handler

import "github.com/samber/do"

func Inject(i *do.Injector) {
	do.Provide(i, New)
}
