// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"bytes"
	"context"
	"encoding/json"
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// Posts Posts
//
// swagger:model Posts
type Posts struct {

	// posts
	Posts []*Post `json:"posts"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (m *Posts) UnmarshalJSON(data []byte) error {
	var props struct {

		// posts
		Posts []*Post `json:"posts"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	m.Posts = props.Posts
	return nil
}

// Validate validates this posts
func (m *Posts) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validatePosts(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *Posts) validatePosts(formats strfmt.Registry) error {
	if swag.IsZero(m.Posts) { // not required
		return nil
	}

	for i := 0; i < len(m.Posts); i++ {
		if swag.IsZero(m.Posts[i]) { // not required
			continue
		}

		if m.Posts[i] != nil {
			if err := m.Posts[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("posts" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("posts" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// ContextValidate validate this posts based on the context it is used
func (m *Posts) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidatePosts(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *Posts) contextValidatePosts(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.Posts); i++ {

		if m.Posts[i] != nil {
			if err := m.Posts[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("posts" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("posts" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *Posts) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *Posts) UnmarshalBinary(b []byte) error {
	var res Posts
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}