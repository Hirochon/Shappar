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

// PostAPIV1PostsPostIDPollsHandlerFunc turns a function with the right signature into a post API v1 posts post ID polls handler
type PostAPIV1PostsPostIDPollsHandlerFunc func(PostAPIV1PostsPostIDPollsParams) middleware.Responder

// Handle executing the request and returning a response
func (fn PostAPIV1PostsPostIDPollsHandlerFunc) Handle(params PostAPIV1PostsPostIDPollsParams) middleware.Responder {
	return fn(params)
}

// PostAPIV1PostsPostIDPollsHandler interface for that can handle valid post API v1 posts post ID polls params
type PostAPIV1PostsPostIDPollsHandler interface {
	Handle(PostAPIV1PostsPostIDPollsParams) middleware.Responder
}

// NewPostAPIV1PostsPostIDPolls creates a new http.Handler for the post API v1 posts post ID polls operation
func NewPostAPIV1PostsPostIDPolls(ctx *middleware.Context, handler PostAPIV1PostsPostIDPollsHandler) *PostAPIV1PostsPostIDPolls {
	return &PostAPIV1PostsPostIDPolls{Context: ctx, Handler: handler}
}

/*
	PostAPIV1PostsPostIDPolls swagger:route POST /api/v1/posts/{post_id}/polls posts postApiV1PostsPostIdPolls

vote post
*/
type PostAPIV1PostsPostIDPolls struct {
	Context *middleware.Context
	Handler PostAPIV1PostsPostIDPollsHandler
}

func (o *PostAPIV1PostsPostIDPolls) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewPostAPIV1PostsPostIDPollsParams()
	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request
	o.Context.Respond(rw, r, route.Produces, route, res)

}

// PostAPIV1PostsPostIDPollsBadRequestBody post API v1 posts post ID polls bad request body
//
// swagger:model PostAPIV1PostsPostIDPollsBadRequestBody
type PostAPIV1PostsPostIDPollsBadRequestBody struct {

	// non field errors
	NonFieldErrors string `json:"non_field_errors,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsPostIDPollsBadRequestBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// non field errors
		NonFieldErrors string `json:"non_field_errors,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.NonFieldErrors = props.NonFieldErrors
	return nil
}

// Validate validates this post API v1 posts post ID polls bad request body
func (o *PostAPIV1PostsPostIDPollsBadRequestBody) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this post API v1 posts post ID polls bad request body based on context it is used
func (o *PostAPIV1PostsPostIDPollsBadRequestBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsBadRequestBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsBadRequestBody) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsPostIDPollsBadRequestBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// PostAPIV1PostsPostIDPollsBody post API v1 posts post ID polls body
//
// swagger:model PostAPIV1PostsPostIDPollsBody
type PostAPIV1PostsPostIDPollsBody struct {

	// option
	Option *PostAPIV1PostsPostIDPollsParamsBodyOption `json:"option,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsPostIDPollsBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// option
		Option *PostAPIV1PostsPostIDPollsParamsBodyOption `json:"option,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Option = props.Option
	return nil
}

// Validate validates this post API v1 posts post ID polls body
func (o *PostAPIV1PostsPostIDPollsBody) Validate(formats strfmt.Registry) error {
	var res []error

	if err := o.validateOption(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PostAPIV1PostsPostIDPollsBody) validateOption(formats strfmt.Registry) error {
	if swag.IsZero(o.Option) { // not required
		return nil
	}

	if o.Option != nil {
		if err := o.Option.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("body" + "." + "option")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("body" + "." + "option")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this post API v1 posts post ID polls body based on the context it is used
func (o *PostAPIV1PostsPostIDPollsBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := o.contextValidateOption(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PostAPIV1PostsPostIDPollsBody) contextValidateOption(ctx context.Context, formats strfmt.Registry) error {

	if o.Option != nil {
		if err := o.Option.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("body" + "." + "option")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("body" + "." + "option")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsBody) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsPostIDPollsBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// PostAPIV1PostsPostIDPollsCreatedBody post API v1 posts post ID polls created body
//
// swagger:model PostAPIV1PostsPostIDPollsCreatedBody
type PostAPIV1PostsPostIDPollsCreatedBody struct {

	// id
	ID int64 `json:"id,omitempty"`

	// options
	Options []*PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0 `json:"options"`

	// selected num
	SelectedNum int64 `json:"selected_num,omitempty"`

	// total
	Total int64 `json:"total,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsPostIDPollsCreatedBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// id
		ID int64 `json:"id,omitempty"`

		// options
		Options []*PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0 `json:"options"`

		// selected num
		SelectedNum int64 `json:"selected_num,omitempty"`

		// total
		Total int64 `json:"total,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.ID = props.ID
	o.Options = props.Options
	o.SelectedNum = props.SelectedNum
	o.Total = props.Total
	return nil
}

// Validate validates this post API v1 posts post ID polls created body
func (o *PostAPIV1PostsPostIDPollsCreatedBody) Validate(formats strfmt.Registry) error {
	var res []error

	if err := o.validateOptions(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PostAPIV1PostsPostIDPollsCreatedBody) validateOptions(formats strfmt.Registry) error {
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
					return ve.ValidateName("postApiV1PostsPostIdPollsCreated" + "." + "options" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("postApiV1PostsPostIdPollsCreated" + "." + "options" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// ContextValidate validate this post API v1 posts post ID polls created body based on the context it is used
func (o *PostAPIV1PostsPostIDPollsCreatedBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := o.contextValidateOptions(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PostAPIV1PostsPostIDPollsCreatedBody) contextValidateOptions(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(o.Options); i++ {

		if o.Options[i] != nil {
			if err := o.Options[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("postApiV1PostsPostIdPollsCreated" + "." + "options" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("postApiV1PostsPostIdPollsCreated" + "." + "options" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsCreatedBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsCreatedBody) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsPostIDPollsCreatedBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0 post API v1 posts post ID polls created body options items0
//
// swagger:model PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0
type PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0 struct {

	// select num
	SelectNum int64 `json:"select_num,omitempty"`

	// votes
	Votes int64 `json:"votes,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0) UnmarshalJSON(data []byte) error {
	var props struct {

		// select num
		SelectNum int64 `json:"select_num,omitempty"`

		// votes
		Votes int64 `json:"votes,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.SelectNum = props.SelectNum
	o.Votes = props.Votes
	return nil
}

// Validate validates this post API v1 posts post ID polls created body options items0
func (o *PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this post API v1 posts post ID polls created body options items0 based on context it is used
func (o *PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsPostIDPollsCreatedBodyOptionsItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// PostAPIV1PostsPostIDPollsNotFoundBody post API v1 posts post ID polls not found body
//
// swagger:model PostAPIV1PostsPostIDPollsNotFoundBody
type PostAPIV1PostsPostIDPollsNotFoundBody struct {

	// detail
	Detail string `json:"detail,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsPostIDPollsNotFoundBody) UnmarshalJSON(data []byte) error {
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

// Validate validates this post API v1 posts post ID polls not found body
func (o *PostAPIV1PostsPostIDPollsNotFoundBody) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this post API v1 posts post ID polls not found body based on context it is used
func (o *PostAPIV1PostsPostIDPollsNotFoundBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsNotFoundBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsNotFoundBody) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsPostIDPollsNotFoundBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// PostAPIV1PostsPostIDPollsParamsBodyOption post API v1 posts post ID polls params body option
//
// swagger:model PostAPIV1PostsPostIDPollsParamsBodyOption
type PostAPIV1PostsPostIDPollsParamsBodyOption struct {

	// select num
	SelectNum int64 `json:"select_num,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostAPIV1PostsPostIDPollsParamsBodyOption) UnmarshalJSON(data []byte) error {
	var props struct {

		// select num
		SelectNum int64 `json:"select_num,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.SelectNum = props.SelectNum
	return nil
}

// Validate validates this post API v1 posts post ID polls params body option
func (o *PostAPIV1PostsPostIDPollsParamsBodyOption) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this post API v1 posts post ID polls params body option based on context it is used
func (o *PostAPIV1PostsPostIDPollsParamsBodyOption) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsParamsBodyOption) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostAPIV1PostsPostIDPollsParamsBodyOption) UnmarshalBinary(b []byte) error {
	var res PostAPIV1PostsPostIDPollsParamsBodyOption
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}
