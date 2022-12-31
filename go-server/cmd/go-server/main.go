package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/Hirochon/Shappar/go-server/internal/ui"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/health"
	"github.com/go-openapi/loads"
	"github.com/go-openapi/runtime/middleware"
)

var portFlag = flag.Int("port", 8040, "Port to run this service on")

func main() {
	fmt.Println(ui.Server("Hello"))
	swaggerSpec, err := loads.Analyzed(restapiv1.SwaggerJSON, "")
	if err != nil {
		log.Fatalln(err)
	}
	api := operations.NewShapparAPI(swaggerSpec)
	server := restapiv1.NewServer(api)
	server.EnabledListeners = []string{"http"}
	defer server.Shutdown()

	flag.Parse()
	server.Port = *portFlag

	api.HealthGetAPIV1HealthHandler = health.GetAPIV1HealthHandlerFunc(
		func(params health.GetAPIV1HealthParams) middleware.Responder {
			return health.NewGetAPIV1HealthOK()
		})

	if err := server.Serve(); err != nil {
		log.Fatalln(err)
	}
}
