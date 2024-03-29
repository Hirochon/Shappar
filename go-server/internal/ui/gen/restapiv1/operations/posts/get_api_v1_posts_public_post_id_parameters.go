// Code generated by go-swagger; DO NOT EDIT.

package posts

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
)

// NewGetAPIV1PostsPublicPostIDParams creates a new GetAPIV1PostsPublicPostIDParams object
//
// There are no default values defined in the spec.
func NewGetAPIV1PostsPublicPostIDParams() GetAPIV1PostsPublicPostIDParams {

	return GetAPIV1PostsPublicPostIDParams{}
}

// GetAPIV1PostsPublicPostIDParams contains all the bound params for the get API v1 posts public post ID operation
// typically these are obtained from a http.Request
//
// swagger:parameters GetAPIV1PostsPublicPostID
type GetAPIV1PostsPublicPostIDParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*
	  Required: true
	  In: path
	*/
	PostID string
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewGetAPIV1PostsPublicPostIDParams() beforehand.
func (o *GetAPIV1PostsPublicPostIDParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	rPostID, rhkPostID, _ := route.Params.GetOK("post_id")
	if err := o.bindPostID(rPostID, rhkPostID, route.Formats); err != nil {
		res = append(res, err)
	}
	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// bindPostID binds and validates parameter PostID from path.
func (o *GetAPIV1PostsPublicPostIDParams) bindPostID(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// Parameter is provided by construction from the route
	o.PostID = raw

	return nil
}
