package main

import (
	"github.com/Hirochon/Shappar/apps/shappar-api/gateway/handler"
	"github.com/Hirochon/Shappar/core/util/config"
	"github.com/samber/do"
)

type injected struct {
	handler *handler.Handler
	// middleware *middleware.Middleware
	httpConf *config.HTTP
	shutdown func() error
}

func inject() *injected {
	i := do.New()
	config.InjectForShapparAPI(i)
	// config.InjectForAuthAPI(i)
	// volume.InjectForAuthAPI(i)
	// storage.InjectForAuthAPI(i)
	// idp.InjectForAuthAPI(i)
	// pubsub.InjectForAuthAPI(i)
	// http.InjectForAuthAPI(i)
	// service.InjectForAuthAPI(i)
	// usecase.Inject(i)
	handler.Inject(i)
	// middleware.Inject(i)

	return &injected{
		handler: do.MustInvoke[*handler.Handler](i),
		// middleware: do.MustInvoke[*middleware.Middleware](i),
		httpConf: do.MustInvoke[*config.HTTP](i),
		shutdown: i.Shutdown,
	}
}
