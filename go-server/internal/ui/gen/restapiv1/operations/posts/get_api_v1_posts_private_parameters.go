// Code generated by go-swagger; DO NOT EDIT.

package posts

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
)

// NewGetAPIV1PostsPrivateParams creates a new GetAPIV1PostsPrivateParams object
//
// There are no default values defined in the spec.
func NewGetAPIV1PostsPrivateParams() GetAPIV1PostsPrivateParams {

	return GetAPIV1PostsPrivateParams{}
}

// GetAPIV1PostsPrivateParams contains all the bound params for the get API v1 posts private operation
// typically these are obtained from a http.Request
//
// swagger:parameters GetAPIV1PostsPrivate
type GetAPIV1PostsPrivateParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*検索キーワード
	  In: query
	*/
	Q *string
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewGetAPIV1PostsPrivateParams() beforehand.
func (o *GetAPIV1PostsPrivateParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	qs := runtime.Values(r.URL.Query())

	qQ, qhkQ, _ := qs.GetOK("q")
	if err := o.bindQ(qQ, qhkQ, route.Formats); err != nil {
		res = append(res, err)
	}
	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// bindQ binds and validates parameter Q from query.
func (o *GetAPIV1PostsPrivateParams) bindQ(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: false
	// AllowEmptyValue: false

	if raw == "" { // empty values pass all other validations
		return nil
	}
	o.Q = &raw

	return nil
}
