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

// NewGetAPIV1PostsPublicParams creates a new GetAPIV1PostsPublicParams object
//
// There are no default values defined in the spec.
func NewGetAPIV1PostsPublicParams() GetAPIV1PostsPublicParams {

	return GetAPIV1PostsPublicParams{}
}

// GetAPIV1PostsPublicParams contains all the bound params for the get API v1 posts public operation
// typically these are obtained from a http.Request
//
// swagger:parameters GetAPIV1PostsPublic
type GetAPIV1PostsPublicParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*追加読み込みの基準
	  In: query
	*/
	Pid *string
	/*検索ワード
	  In: query
	*/
	Q *string
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewGetAPIV1PostsPublicParams() beforehand.
func (o *GetAPIV1PostsPublicParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	qs := runtime.Values(r.URL.Query())

	qPid, qhkPid, _ := qs.GetOK("pid")
	if err := o.bindPid(qPid, qhkPid, route.Formats); err != nil {
		res = append(res, err)
	}

	qQ, qhkQ, _ := qs.GetOK("q")
	if err := o.bindQ(qQ, qhkQ, route.Formats); err != nil {
		res = append(res, err)
	}
	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// bindPid binds and validates parameter Pid from query.
func (o *GetAPIV1PostsPublicParams) bindPid(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: false
	// AllowEmptyValue: false

	if raw == "" { // empty values pass all other validations
		return nil
	}
	o.Pid = &raw

	return nil
}

// bindQ binds and validates parameter Q from query.
func (o *GetAPIV1PostsPublicParams) bindQ(rawData []string, hasKey bool, formats strfmt.Registry) error {
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
