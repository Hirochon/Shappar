package ui

import (
	"flag"

	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/models"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/administrations"
	"github.com/go-openapi/loads"
	"github.com/go-openapi/runtime/middleware"
)

func healthCheck(params administrations.GetAPIV1HealthParams) middleware.Responder {
	res := administrations.NewGetAPIV1HealthOK()
	return res.WithPayload(&models.HealthCheck{
		Status: "OK",
	})
}

func registerHandler(shapparAPI *operations.ShapparAPI) {
	shapparAPI.AdministrationsGetAPIV1HealthHandler = administrations.GetAPIV1HealthHandlerFunc(healthCheck)
}

var portFlag = flag.Int("port", 8040, "Port to run this service on")

func NewShapparAPI() *operations.ShapparAPI {
	swaggerSpec, err := loads.Analyzed(restapiv1.SwaggerJSON, "")
	if err != nil {
		panic(err)
	}
	shapparAPI := operations.NewShapparAPI(swaggerSpec)
	registerHandler(shapparAPI)
	return shapparAPI
}

func NewShapparServer(shapparAPI *operations.ShapparAPI) (*restapiv1.Server, error) {
	shapparServer := restapiv1.NewServer(shapparAPI)
	shapparServer.EnabledListeners = []string{"http"}
	flag.Parse()
	shapparServer.Port = *portFlag
	return shapparServer, nil
}
