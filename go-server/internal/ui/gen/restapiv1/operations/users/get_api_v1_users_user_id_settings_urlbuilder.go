// Code generated by go-swagger; DO NOT EDIT.

package users

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"errors"
	"net/url"
	golangswaggerpaths "path"
	"strings"
)

// GetAPIV1UsersUserIDSettingsURL generates an URL for the get API v1 users user ID settings operation
type GetAPIV1UsersUserIDSettingsURL struct {
	UserID string

	_basePath string
	// avoid unkeyed usage
	_ struct{}
}

// WithBasePath sets the base path for this url builder, only required when it's different from the
// base path specified in the swagger spec.
// When the value of the base path is an empty string
func (o *GetAPIV1UsersUserIDSettingsURL) WithBasePath(bp string) *GetAPIV1UsersUserIDSettingsURL {
	o.SetBasePath(bp)
	return o
}

// SetBasePath sets the base path for this url builder, only required when it's different from the
// base path specified in the swagger spec.
// When the value of the base path is an empty string
func (o *GetAPIV1UsersUserIDSettingsURL) SetBasePath(bp string) {
	o._basePath = bp
}

// Build a url path and query string
func (o *GetAPIV1UsersUserIDSettingsURL) Build() (*url.URL, error) {
	var _result url.URL

	var _path = "/api/v1/users/{user_id}/settings"

	userID := o.UserID
	if userID != "" {
		_path = strings.Replace(_path, "{user_id}", userID, -1)
	} else {
		return nil, errors.New("userId is required on GetAPIV1UsersUserIDSettingsURL")
	}

	_basePath := o._basePath
	_result.Path = golangswaggerpaths.Join(_basePath, _path)

	return &_result, nil
}

// Must is a helper function to panic when the url builder returns an error
func (o *GetAPIV1UsersUserIDSettingsURL) Must(u *url.URL, err error) *url.URL {
	if err != nil {
		panic(err)
	}
	if u == nil {
		panic("url can't be nil")
	}
	return u
}

// String returns the string representation of the path with query string
func (o *GetAPIV1UsersUserIDSettingsURL) String() string {
	return o.Must(o.Build()).String()
}

// BuildFull builds a full url with scheme, host, path and query string
func (o *GetAPIV1UsersUserIDSettingsURL) BuildFull(scheme, host string) (*url.URL, error) {
	if scheme == "" {
		return nil, errors.New("scheme is required for a full url on GetAPIV1UsersUserIDSettingsURL")
	}
	if host == "" {
		return nil, errors.New("host is required for a full url on GetAPIV1UsersUserIDSettingsURL")
	}

	base, err := o.Build()
	if err != nil {
		return nil, err
	}

	base.Scheme = scheme
	base.Host = host
	return base, nil
}

// StringFull returns the string representation of a complete url
func (o *GetAPIV1UsersUserIDSettingsURL) StringFull(scheme, host string) string {
	return o.Must(o.BuildFull(scheme, host)).String()
}
