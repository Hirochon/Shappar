// Code generated by go-swagger; DO NOT EDIT.

package posts

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// PostAPIV1PostsHandlerFunc turns a function with the right signature into a post API v1 posts handler
type PostAPIV1PostsHandlerFunc func(PostAPIV1PostsParams) middleware.Responder

// Handle executing the request and returning a response
func (fn PostAPIV1PostsHandlerFunc) Handle(params PostAPIV1PostsParams) middleware.Responder {
	return fn(params)
}

// PostAPIV1PostsHandler interface for that can handle valid post API v1 posts params
type PostAPIV1PostsHandler interface {
	Handle(PostAPIV1PostsParams) middleware.Responder
}

// NewPostAPIV1Posts creates a new http.Handler for the post API v1 posts operation
func NewPostAPIV1Posts(ctx *middleware.Context, handler PostAPIV1PostsHandler) *PostAPIV1Posts {
	return &PostAPIV1Posts{Context: ctx, Handler: handler}
}

/*
	PostAPIV1Posts swagger:route POST /api/v1/posts posts postApiV1Posts

new post
*/
type PostAPIV1Posts struct {
	Context *middleware.Context
	Handler PostAPIV1PostsHandler
}

func (o *PostAPIV1Posts) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewPostAPIV1PostsParams()
	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request
	o.Context.Respond(rw, r, route.Produces, route, res)

}

// PostAPIV1PostsBadRequestBody post API v1 posts bad request body
//
// swagger:model PostAPIV1PostsBadRequestBody
type PostAPIV1PostsBadRequestBody struct {

	// options
	Options []*PostAPIV1PostsBadRequestBodyOptionsItems0 `json:"options"`

	// question
	Question string `json:"question,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsBadRequestBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// options
		Options []*PostAPIV1PostsBadRequestBodyOptionsItems0 `json:"options"`

		// question
		Question string `json:"question,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Options = props.Options
	o.Question = props.Question
	return nil
}

// Validate validates this post API v1 posts bad request body
func (o *PostAPIV1PostsBadRequestBody) Validate(formats strfmt.Registry) error {
	var res []error

	if err := o.validateOptions(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PostAPIV1PostsBadRequestBody) validateOptions(formats strfmt.Registry) error {
	if swag.IsZero(o.Options) { // not required
		return nil
	}

	for i := 0; i < len(o.Options); i++ {
		if swag.IsZero(o.Options[i]) { // not required
			continue
		}

		if o.Options[i] != nil {
			if err := o.Options[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("postApiV1PostsBadRequest" + "." + "options" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("postApiV1PostsBadRequest" + "." + "options" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// ContextValidate validate this post API v1 posts bad request body based on the context it is used
func (o *PostAPIV1PostsBadRequestBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := o.contextValidateOptions(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PostAPIV1PostsBadRequestBody) contextValidateOptions(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(o.Options); i++ {

		if o.Options[i] != nil {
			if err := o.Options[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("postApiV1PostsBadRequest" + "." + "options" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("postApiV1PostsBadRequest" + "." + "options" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsBadRequestBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsBadRequestBody) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsBadRequestBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// PostAPIV1PostsBadRequestBodyOptionsItems0 post API v1 posts bad request body options items0
//
// swagger:model PostAPIV1PostsBadRequestBodyOptionsItems0
type PostAPIV1PostsBadRequestBodyOptionsItems0 struct {

	// answer
	Answer string `json:"answer,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsBadRequestBodyOptionsItems0) UnmarshalJSON(data []byte) error {
	var props struct {

		// answer
		Answer string `json:"answer,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Answer = props.Answer
	return nil
}

// Validate validates this post API v1 posts bad request body options items0
func (o *PostAPIV1PostsBadRequestBodyOptionsItems0) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this post API v1 posts bad request body options items0 based on context it is used
func (o *PostAPIV1PostsBadRequestBodyOptionsItems0) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsBadRequestBodyOptionsItems0) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsBadRequestBodyOptionsItems0) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsBadRequestBodyOptionsItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// PostAPIV1PostsBody post API v1 posts body
//
// swagger:model PostAPIV1PostsBody
type PostAPIV1PostsBody struct {

	// options
	Options []*PostAPIV1PostsParamsBodyOptionsItems0 `json:"options"`

	// question
	Question string `json:"question,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// options
		Options []*PostAPIV1PostsParamsBodyOptionsItems0 `json:"options"`

		// question
		Question string `json:"question,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Options = props.Options
	o.Question = props.Question
	return nil
}

// Validate validates this post API v1 posts body
func (o *PostAPIV1PostsBody) Validate(formats strfmt.Registry) error {
	var res []error

	if err := o.validateOptions(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PostAPIV1PostsBody) validateOptions(formats strfmt.Registry) error {
	if swag.IsZero(o.Options) { // not required
		return nil
	}

	for i := 0; i < len(o.Options); i++ {
		if swag.IsZero(o.Options[i]) { // not required
			continue
		}

		if o.Options[i] != nil {
			if err := o.Options[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("body" + "." + "options" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("body" + "." + "options" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// ContextValidate validate this post API v1 posts body based on the context it is used
func (o *PostAPIV1PostsBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := o.contextValidateOptions(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PostAPIV1PostsBody) contextValidateOptions(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(o.Options); i++ {

		if o.Options[i] != nil {
			if err := o.Options[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("body" + "." + "options" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("body" + "." + "options" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsBody) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// PostAPIV1PostsParamsBodyOptionsItems0 post API v1 posts params body options items0
//
// swagger:model PostAPIV1PostsParamsBodyOptionsItems0
type PostAPIV1PostsParamsBodyOptionsItems0 struct {

	// answer
	Answer string `json:"answer,omitempty"`

	// select num
	SelectNum int64 `json:"select_num,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsParamsBodyOptionsItems0) UnmarshalJSON(data []byte) error {
	var props struct {

		// answer
		Answer string `json:"answer,omitempty"`

		// select num
		SelectNum int64 `json:"select_num,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Answer = props.Answer
	o.SelectNum = props.SelectNum
	return nil
}

// Validate validates this post API v1 posts params body options items0
func (o *PostAPIV1PostsParamsBodyOptionsItems0) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this post API v1 posts params body options items0 based on context it is used
func (o *PostAPIV1PostsParamsBodyOptionsItems0) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsParamsBodyOptionsItems0) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsParamsBodyOptionsItems0) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsParamsBodyOptionsItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}
