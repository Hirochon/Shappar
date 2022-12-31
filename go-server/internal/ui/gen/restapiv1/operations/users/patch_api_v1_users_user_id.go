// Code generated by go-swagger; DO NOT EDIT.

package users

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

// PatchAPIV1UsersUserIDHandlerFunc turns a function with the right signature into a patch API v1 users user ID handler
type PatchAPIV1UsersUserIDHandlerFunc func(PatchAPIV1UsersUserIDParams) middleware.Responder

// Handle executing the request and returning a response
func (fn PatchAPIV1UsersUserIDHandlerFunc) Handle(params PatchAPIV1UsersUserIDParams) middleware.Responder {
	return fn(params)
}

// PatchAPIV1UsersUserIDHandler interface for that can handle valid patch API v1 users user ID params
type PatchAPIV1UsersUserIDHandler interface {
	Handle(PatchAPIV1UsersUserIDParams) middleware.Responder
}

// NewPatchAPIV1UsersUserID creates a new http.Handler for the patch API v1 users user ID operation
func NewPatchAPIV1UsersUserID(ctx *middleware.Context, handler PatchAPIV1UsersUserIDHandler) *PatchAPIV1UsersUserID {
	return &PatchAPIV1UsersUserID{Context: ctx, Handler: handler}
}

/*
	PatchAPIV1UsersUserID swagger:route PATCH /api/v1/users/{user_id} users patchApiV1UsersUserId

user detail update
*/
type PatchAPIV1UsersUserID struct {
	Context *middleware.Context
	Handler PatchAPIV1UsersUserIDHandler
}

func (o *PatchAPIV1UsersUserID) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewPatchAPIV1UsersUserIDParams()
	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request
	o.Context.Respond(rw, r, route.Produces, route, res)

}

// PatchAPIV1UsersUserIDBody patch API v1 users user ID body
//
// swagger:model PatchAPIV1UsersUserIDBody
type PatchAPIV1UsersUserIDBody struct {

	// homeimage
	Homeimage string `json:"homeimage,omitempty"`

	// iconimage
	Iconimage string `json:"iconimage,omitempty"`

	// introduction
	Introduction string `json:"introduction,omitempty"`

	// name
	Name string `json:"name,omitempty"`

	// user id
	UserID string `json:"user_id,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PatchAPIV1UsersUserIDBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// homeimage
		Homeimage string `json:"homeimage,omitempty"`

		// iconimage
		Iconimage string `json:"iconimage,omitempty"`

		// introduction
		Introduction string `json:"introduction,omitempty"`

		// name
		Name string `json:"name,omitempty"`

		// user id
		UserID string `json:"user_id,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Homeimage = props.Homeimage
	o.Iconimage = props.Iconimage
	o.Introduction = props.Introduction
	o.Name = props.Name
	o.UserID = props.UserID
	return nil
}

// Validate validates this patch API v1 users user ID body
func (o *PatchAPIV1UsersUserIDBody) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this patch API v1 users user ID body based on context it is used
func (o *PatchAPIV1UsersUserIDBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *PatchAPIV1UsersUserIDBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PatchAPIV1UsersUserIDBody) UnmarshalBinary(b []byte) error {
	var res PatchAPIV1UsersUserIDBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}
