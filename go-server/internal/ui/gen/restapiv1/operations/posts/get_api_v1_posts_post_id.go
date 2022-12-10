// Code generated by go-swagger; DO NOT EDIT.

package posts

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// GetAPIV1PostsPostIDHandlerFunc turns a function with the right signature into a get API v1 posts post ID handler
type GetAPIV1PostsPostIDHandlerFunc func(GetAPIV1PostsPostIDParams) middleware.Responder

// Handle executing the request and returning a response
func (fn GetAPIV1PostsPostIDHandlerFunc) Handle(params GetAPIV1PostsPostIDParams) middleware.Responder {
	return fn(params)
}

// GetAPIV1PostsPostIDHandler interface for that can handle valid get API v1 posts post ID params
type GetAPIV1PostsPostIDHandler interface {
	Handle(GetAPIV1PostsPostIDParams) middleware.Responder
}

// NewGetAPIV1PostsPostID creates a new http.Handler for the get API v1 posts post ID operation
func NewGetAPIV1PostsPostID(ctx *middleware.Context, handler GetAPIV1PostsPostIDHandler) *GetAPIV1PostsPostID {
	return &GetAPIV1PostsPostID{Context: ctx, Handler: handler}
}

/*
	GetAPIV1PostsPostID swagger:route GET /api/v1/posts/{post_id} posts getApiV1PostsPostId

# Your GET endpoint

get post details
*/
type GetAPIV1PostsPostID struct {
	Context *middleware.Context
	Handler GetAPIV1PostsPostIDHandler
}

func (o *GetAPIV1PostsPostID) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewGetAPIV1PostsPostIDParams()
	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request
	o.Context.Respond(rw, r, route.Produces, route, res)

}

// GetAPIV1PostsPostIDNotFoundBody get API v1 posts post ID not found body
//
// swagger:model GetAPIV1PostsPostIDNotFoundBody
type GetAPIV1PostsPostIDNotFoundBody struct {

	// detail
	Detail string `json:"detail,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *GetAPIV1PostsPostIDNotFoundBody) UnmarshalJSON(data []byte) error {
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

// Validate validates this get API v1 posts post ID not found body
func (o *GetAPIV1PostsPostIDNotFoundBody) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this get API v1 posts post ID not found body based on context it is used
func (o *GetAPIV1PostsPostIDNotFoundBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDNotFoundBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDNotFoundBody) UnmarshalBinary(b []byte) error {
	var res GetAPIV1PostsPostIDNotFoundBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// GetAPIV1PostsPostIDOKBody get API v1 posts post ID o k body
//
// swagger:model GetAPIV1PostsPostIDOKBody
type GetAPIV1PostsPostIDOKBody struct {

	// total
	Total int64 `json:"total,omitempty"`

	// voted age
	VotedAge *GetAPIV1PostsPostIDOKBodyVotedAge `json:"voted_age,omitempty"`

	// voted blood type
	VotedBloodType *GetAPIV1PostsPostIDOKBodyVotedBloodType `json:"voted_blood_type,omitempty"`

	// voted month
	VotedMonth *GetAPIV1PostsPostIDOKBodyVotedMonth `json:"voted_month,omitempty"`

	// voted sex
	VotedSex *GetAPIV1PostsPostIDOKBodyVotedSex `json:"voted_sex,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *GetAPIV1PostsPostIDOKBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// total
		Total int64 `json:"total,omitempty"`

		// voted age
		VotedAge *GetAPIV1PostsPostIDOKBodyVotedAge `json:"voted_age,omitempty"`

		// voted blood type
		VotedBloodType *GetAPIV1PostsPostIDOKBodyVotedBloodType `json:"voted_blood_type,omitempty"`

		// voted month
		VotedMonth *GetAPIV1PostsPostIDOKBodyVotedMonth `json:"voted_month,omitempty"`

		// voted sex
		VotedSex *GetAPIV1PostsPostIDOKBodyVotedSex `json:"voted_sex,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Total = props.Total
	o.VotedAge = props.VotedAge
	o.VotedBloodType = props.VotedBloodType
	o.VotedMonth = props.VotedMonth
	o.VotedSex = props.VotedSex
	return nil
}

// Validate validates this get API v1 posts post ID o k body
func (o *GetAPIV1PostsPostIDOKBody) Validate(formats strfmt.Registry) error {
	var res []error

	if err := o.validateVotedAge(formats); err != nil {
		res = append(res, err)
	}

	if err := o.validateVotedBloodType(formats); err != nil {
		res = append(res, err)
	}

	if err := o.validateVotedMonth(formats); err != nil {
		res = append(res, err)
	}

	if err := o.validateVotedSex(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *GetAPIV1PostsPostIDOKBody) validateVotedAge(formats strfmt.Registry) error {
	if swag.IsZero(o.VotedAge) { // not required
		return nil
	}

	if o.VotedAge != nil {
		if err := o.VotedAge.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_age")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_age")
			}
			return err
		}
	}

	return nil
}

func (o *GetAPIV1PostsPostIDOKBody) validateVotedBloodType(formats strfmt.Registry) error {
	if swag.IsZero(o.VotedBloodType) { // not required
		return nil
	}

	if o.VotedBloodType != nil {
		if err := o.VotedBloodType.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_blood_type")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_blood_type")
			}
			return err
		}
	}

	return nil
}

func (o *GetAPIV1PostsPostIDOKBody) validateVotedMonth(formats strfmt.Registry) error {
	if swag.IsZero(o.VotedMonth) { // not required
		return nil
	}

	if o.VotedMonth != nil {
		if err := o.VotedMonth.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_month")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_month")
			}
			return err
		}
	}

	return nil
}

func (o *GetAPIV1PostsPostIDOKBody) validateVotedSex(formats strfmt.Registry) error {
	if swag.IsZero(o.VotedSex) { // not required
		return nil
	}

	if o.VotedSex != nil {
		if err := o.VotedSex.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_sex")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_sex")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this get API v1 posts post ID o k body based on the context it is used
func (o *GetAPIV1PostsPostIDOKBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := o.contextValidateVotedAge(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := o.contextValidateVotedBloodType(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := o.contextValidateVotedMonth(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := o.contextValidateVotedSex(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *GetAPIV1PostsPostIDOKBody) contextValidateVotedAge(ctx context.Context, formats strfmt.Registry) error {

	if o.VotedAge != nil {
		if err := o.VotedAge.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_age")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_age")
			}
			return err
		}
	}

	return nil
}

func (o *GetAPIV1PostsPostIDOKBody) contextValidateVotedBloodType(ctx context.Context, formats strfmt.Registry) error {

	if o.VotedBloodType != nil {
		if err := o.VotedBloodType.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_blood_type")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_blood_type")
			}
			return err
		}
	}

	return nil
}

func (o *GetAPIV1PostsPostIDOKBody) contextValidateVotedMonth(ctx context.Context, formats strfmt.Registry) error {

	if o.VotedMonth != nil {
		if err := o.VotedMonth.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_month")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_month")
			}
			return err
		}
	}

	return nil
}

func (o *GetAPIV1PostsPostIDOKBody) contextValidateVotedSex(ctx context.Context, formats strfmt.Registry) error {

	if o.VotedSex != nil {
		if err := o.VotedSex.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_sex")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("getApiV1PostsPostIdOK" + "." + "voted_sex")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBody) UnmarshalBinary(b []byte) error {
	var res GetAPIV1PostsPostIDOKBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// GetAPIV1PostsPostIDOKBodyVotedAge get API v1 posts post ID o k body voted age
//
// swagger:model GetAPIV1PostsPostIDOKBodyVotedAge
type GetAPIV1PostsPostIDOKBodyVotedAge struct {

	// 0 10
	Nr010 int64 `json:"0-10,omitempty"`

	// 10 20
	Nr1020 int64 `json:"10-20,omitempty"`

	// 20 30
	Nr2030 int64 `json:"20-30,omitempty"`

	// 30 40
	Nr3040 int64 `json:"30-40,omitempty"`

	// 40 50
	Nr4050 int64 `json:"40-50,omitempty"`

	// 50 60
	Nr5060 int64 `json:"50-60,omitempty"`

	// 60
	Nr60 int64 `json:"60-,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *GetAPIV1PostsPostIDOKBodyVotedAge) UnmarshalJSON(data []byte) error {
	var props struct {

		// 0 10
		Nr010 int64 `json:"0-10,omitempty"`

		// 10 20
		Nr1020 int64 `json:"10-20,omitempty"`

		// 20 30
		Nr2030 int64 `json:"20-30,omitempty"`

		// 30 40
		Nr3040 int64 `json:"30-40,omitempty"`

		// 40 50
		Nr4050 int64 `json:"40-50,omitempty"`

		// 50 60
		Nr5060 int64 `json:"50-60,omitempty"`

		// 60
		Nr60 int64 `json:"60-,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Nr010 = props.Nr010
	o.Nr1020 = props.Nr1020
	o.Nr2030 = props.Nr2030
	o.Nr3040 = props.Nr3040
	o.Nr4050 = props.Nr4050
	o.Nr5060 = props.Nr5060
	o.Nr60 = props.Nr60
	return nil
}

// Validate validates this get API v1 posts post ID o k body voted age
func (o *GetAPIV1PostsPostIDOKBodyVotedAge) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this get API v1 posts post ID o k body voted age based on context it is used
func (o *GetAPIV1PostsPostIDOKBodyVotedAge) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBodyVotedAge) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBodyVotedAge) UnmarshalBinary(b []byte) error {
	var res GetAPIV1PostsPostIDOKBodyVotedAge
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// GetAPIV1PostsPostIDOKBodyVotedBloodType get API v1 posts post ID o k body voted blood type
//
// swagger:model GetAPIV1PostsPostIDOKBodyVotedBloodType
type GetAPIV1PostsPostIDOKBodyVotedBloodType struct {

	// a
	A int64 `json:"A,omitempty"`

	// a b
	AB int64 `json:"AB,omitempty"`

	// b
	B int64 `json:"B,omitempty"`

	// o
	O int64 `json:"O,omitempty"`

	// others
	Others int64 `json:"others,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *GetAPIV1PostsPostIDOKBodyVotedBloodType) UnmarshalJSON(data []byte) error {
	var props struct {

		// a
		A int64 `json:"A,omitempty"`

		// a b
		AB int64 `json:"AB,omitempty"`

		// b
		B int64 `json:"B,omitempty"`

		// o
		O int64 `json:"O,omitempty"`

		// others
		Others int64 `json:"others,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.A = props.A
	o.AB = props.AB
	o.B = props.B
	o.O = props.O
	o.Others = props.Others
	return nil
}

// Validate validates this get API v1 posts post ID o k body voted blood type
func (o *GetAPIV1PostsPostIDOKBodyVotedBloodType) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this get API v1 posts post ID o k body voted blood type based on context it is used
func (o *GetAPIV1PostsPostIDOKBodyVotedBloodType) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBodyVotedBloodType) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBodyVotedBloodType) UnmarshalBinary(b []byte) error {
	var res GetAPIV1PostsPostIDOKBodyVotedBloodType
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// GetAPIV1PostsPostIDOKBodyVotedMonth get API v1 posts post ID o k body voted month
//
// swagger:model GetAPIV1PostsPostIDOKBodyVotedMonth
type GetAPIV1PostsPostIDOKBodyVotedMonth struct {

	// 1
	Nr1 int64 `json:"1,omitempty"`

	// 10
	Nr10 int64 `json:"10,omitempty"`

	// 11
	Nr11 int64 `json:"11,omitempty"`

	// 12
	Nr12 int64 `json:"12,omitempty"`

	// 2
	Nr2 int64 `json:"2,omitempty"`

	// 3
	Nr3 int64 `json:"3,omitempty"`

	// 4
	Nr4 int64 `json:"4,omitempty"`

	// 5
	Nr5 int64 `json:"5,omitempty"`

	// 6
	Nr6 int64 `json:"6,omitempty"`

	// 7
	Nr7 int64 `json:"7,omitempty"`

	// 8
	Nr8 int64 `json:"8,omitempty"`

	// 9
	Nr9 int64 `json:"9,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *GetAPIV1PostsPostIDOKBodyVotedMonth) UnmarshalJSON(data []byte) error {
	var props struct {

		// 1
		Nr1 int64 `json:"1,omitempty"`

		// 10
		Nr10 int64 `json:"10,omitempty"`

		// 11
		Nr11 int64 `json:"11,omitempty"`

		// 12
		Nr12 int64 `json:"12,omitempty"`

		// 2
		Nr2 int64 `json:"2,omitempty"`

		// 3
		Nr3 int64 `json:"3,omitempty"`

		// 4
		Nr4 int64 `json:"4,omitempty"`

		// 5
		Nr5 int64 `json:"5,omitempty"`

		// 6
		Nr6 int64 `json:"6,omitempty"`

		// 7
		Nr7 int64 `json:"7,omitempty"`

		// 8
		Nr8 int64 `json:"8,omitempty"`

		// 9
		Nr9 int64 `json:"9,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Nr1 = props.Nr1
	o.Nr10 = props.Nr10
	o.Nr11 = props.Nr11
	o.Nr12 = props.Nr12
	o.Nr2 = props.Nr2
	o.Nr3 = props.Nr3
	o.Nr4 = props.Nr4
	o.Nr5 = props.Nr5
	o.Nr6 = props.Nr6
	o.Nr7 = props.Nr7
	o.Nr8 = props.Nr8
	o.Nr9 = props.Nr9
	return nil
}

// Validate validates this get API v1 posts post ID o k body voted month
func (o *GetAPIV1PostsPostIDOKBodyVotedMonth) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this get API v1 posts post ID o k body voted month based on context it is used
func (o *GetAPIV1PostsPostIDOKBodyVotedMonth) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBodyVotedMonth) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBodyVotedMonth) UnmarshalBinary(b []byte) error {
	var res GetAPIV1PostsPostIDOKBodyVotedMonth
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// GetAPIV1PostsPostIDOKBodyVotedSex get API v1 posts post ID o k body voted sex
//
// swagger:model GetAPIV1PostsPostIDOKBodyVotedSex
type GetAPIV1PostsPostIDOKBodyVotedSex struct {

	// man
	Man int64 `json:"man,omitempty"`

	// null
	Null int64 `json:"null,omitempty"`

	// others
	Others int64 `json:"others,omitempty"`

	// woman
	Woman int64 `json:"woman,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *GetAPIV1PostsPostIDOKBodyVotedSex) UnmarshalJSON(data []byte) error {
	var props struct {

		// man
		Man int64 `json:"man,omitempty"`

		// null
		Null int64 `json:"null,omitempty"`

		// others
		Others int64 `json:"others,omitempty"`

		// woman
		Woman int64 `json:"woman,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Man = props.Man
	o.Null = props.Null
	o.Others = props.Others
	o.Woman = props.Woman
	return nil
}

// Validate validates this get API v1 posts post ID o k body voted sex
func (o *GetAPIV1PostsPostIDOKBodyVotedSex) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this get API v1 posts post ID o k body voted sex based on context it is used
func (o *GetAPIV1PostsPostIDOKBodyVotedSex) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBodyVotedSex) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetAPIV1PostsPostIDOKBodyVotedSex) UnmarshalBinary(b []byte) error {
	var res GetAPIV1PostsPostIDOKBodyVotedSex
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}