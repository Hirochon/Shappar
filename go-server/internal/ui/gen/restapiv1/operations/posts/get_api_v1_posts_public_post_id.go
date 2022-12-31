// Code generated by go-swagger; DO NOT EDIT.

package posts

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// GetAPIV1PostsPublicPostIDHandlerFunc turns a function with the right signature into a get API v1 posts public post ID handler
type GetAPIV1PostsPublicPostIDHandlerFunc func(GetAPIV1PostsPublicPostIDParams) middleware.Responder

// Handle executing the request and returning a response
func (fn GetAPIV1PostsPublicPostIDHandlerFunc) Handle(params GetAPIV1PostsPublicPostIDParams) middleware.Responder {
	return fn(params)
}

// GetAPIV1PostsPublicPostIDHandler interface for that can handle valid get API v1 posts public post ID params
type GetAPIV1PostsPublicPostIDHandler interface {
	Handle(GetAPIV1PostsPublicPostIDParams) middleware.Responder
}

// NewGetAPIV1PostsPublicPostID creates a new http.Handler for the get API v1 posts public post ID operation
func NewGetAPIV1PostsPublicPostID(ctx *middleware.Context, handler GetAPIV1PostsPublicPostIDHandler) *GetAPIV1PostsPublicPostID {
	return &GetAPIV1PostsPublicPostID{Context: ctx, Handler: handler}
}

/*
	GetAPIV1PostsPublicPostID swagger:route GET /api/v1/posts/public/{post_id} posts getApiV1PostsPublicPostId

# Your GET endpoint

get post details
*/
type GetAPIV1PostsPublicPostID struct {
	Context *middleware.Context
	Handler GetAPIV1PostsPublicPostIDHandler
}

func (o *GetAPIV1PostsPublicPostID) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewGetAPIV1PostsPublicPostIDParams()
	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request
	o.Context.Respond(rw, r, route.Produces, route, res)

}

// GetAPIV1PostsPublicPostIDNotFoundBody get API v1 posts public post ID not found body
//
// swagger:model GetAPIV1PostsPublicPostIDNotFoundBody
type GetAPIV1PostsPublicPostIDNotFoundBody struct {

	// detail
	Detail string `json:"detail,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *GetAPIV1PostsPublicPostIDNotFoundBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// detail
		Detail string `json:"detail,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Detail = props.Detail
	return nil
}

// Validate validates this get API v1 posts public post ID not found body
func (o *GetAPIV1PostsPublicPostIDNotFoundBody) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this get API v1 posts public post ID not found body based on context it is used
func (o *GetAPIV1PostsPublicPostIDNotFoundBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *GetAPIV1PostsPublicPostIDNotFoundBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetAPIV1PostsPublicPostIDNotFoundBody) UnmarshalBinary(b []byte) error {
	var res GetAPIV1PostsPublicPostIDNotFoundBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}
