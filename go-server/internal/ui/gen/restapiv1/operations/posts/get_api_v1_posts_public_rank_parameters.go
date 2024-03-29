// Code generated by go-swagger; DO NOT EDIT.

package posts

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
)

// NewGetAPIV1PostsPublicRankParams creates a new GetAPIV1PostsPublicRankParams object
//
// There are no default values defined in the spec.
func NewGetAPIV1PostsPublicRankParams() GetAPIV1PostsPublicRankParams {

	return GetAPIV1PostsPublicRankParams{}
}

// GetAPIV1PostsPublicRankParams contains all the bound params for the get API v1 posts public rank operation
// typically these are obtained from a http.Request
//
// swagger:parameters GetAPIV1PostsPublicRank
type GetAPIV1PostsPublicRankParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewGetAPIV1PostsPublicRankParams() beforehand.
func (o *GetAPIV1PostsPublicRankParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}
