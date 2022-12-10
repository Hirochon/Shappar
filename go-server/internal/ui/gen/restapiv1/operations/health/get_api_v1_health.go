// Code generated by go-swagger; DO NOT EDIT.

package health

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"net/http"

	"github.com/go-openapi/runtime/middleware"
)

// GetAPIV1HealthHandlerFunc turns a function with the right signature into a get API v1 health handler
type GetAPIV1HealthHandlerFunc func(GetAPIV1HealthParams) middleware.Responder

// Handle executing the request and returning a response
func (fn GetAPIV1HealthHandlerFunc) Handle(params GetAPIV1HealthParams) middleware.Responder {
	return fn(params)
}

// GetAPIV1HealthHandler interface for that can handle valid get API v1 health params
type GetAPIV1HealthHandler interface {
	Handle(GetAPIV1HealthParams) middleware.Responder
}

// NewGetAPIV1Health creates a new http.Handler for the get API v1 health operation
func NewGetAPIV1Health(ctx *middleware.Context, handler GetAPIV1HealthHandler) *GetAPIV1Health {
	return &GetAPIV1Health{Context: ctx, Handler: handler}
}

/*
	GetAPIV1Health swagger:route GET /api/v1/health health getApiV1Health

health check
*/
type GetAPIV1Health struct {
	Context *middleware.Context
	Handler GetAPIV1HealthHandler
}

func (o *GetAPIV1Health) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewGetAPIV1HealthParams()
	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request
	o.Context.Respond(rw, r, route.Produces, route, res)

}