// Code generated by go-swagger; DO NOT EDIT.

package friendships

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"net/http"

	"github.com/go-openapi/runtime/middleware"
)

// GetAPIV1FrendshipsUserIDFollowingHandlerFunc turns a function with the right signature into a get API v1 frendships user ID following handler
type GetAPIV1FrendshipsUserIDFollowingHandlerFunc func(GetAPIV1FrendshipsUserIDFollowingParams) middleware.Responder

// Handle executing the request and returning a response
func (fn GetAPIV1FrendshipsUserIDFollowingHandlerFunc) Handle(params GetAPIV1FrendshipsUserIDFollowingParams) middleware.Responder {
	return fn(params)
}

// GetAPIV1FrendshipsUserIDFollowingHandler interface for that can handle valid get API v1 frendships user ID following params
type GetAPIV1FrendshipsUserIDFollowingHandler interface {
	Handle(GetAPIV1FrendshipsUserIDFollowingParams) middleware.Responder
}

// NewGetAPIV1FrendshipsUserIDFollowing creates a new http.Handler for the get API v1 frendships user ID following operation
func NewGetAPIV1FrendshipsUserIDFollowing(ctx *middleware.Context, handler GetAPIV1FrendshipsUserIDFollowingHandler) *GetAPIV1FrendshipsUserIDFollowing {
	return &GetAPIV1FrendshipsUserIDFollowing{Context: ctx, Handler: handler}
}

/*
	GetAPIV1FrendshipsUserIDFollowing swagger:route GET /api/v1/frendships/{userId}/following friendships getApiV1FrendshipsUserIdFollowing

# Your GET endpoint

get following users
*/
type GetAPIV1FrendshipsUserIDFollowing struct {
	Context *middleware.Context
	Handler GetAPIV1FrendshipsUserIDFollowingHandler
}

func (o *GetAPIV1FrendshipsUserIDFollowing) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewGetAPIV1FrendshipsUserIDFollowingParams()
	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request
	o.Context.Respond(rw, r, route.Produces, route, res)

}
