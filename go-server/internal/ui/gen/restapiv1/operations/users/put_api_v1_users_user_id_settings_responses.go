// Code generated by go-swagger; DO NOT EDIT.

package users

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"
)

// PutAPIV1UsersUserIDSettingsOKCode is the HTTP code returned for type PutAPIV1UsersUserIDSettingsOK
const PutAPIV1UsersUserIDSettingsOKCode int = 200

/*
PutAPIV1UsersUserIDSettingsOK OK

swagger:response putApiV1UsersUserIdSettingsOK
*/
type PutAPIV1UsersUserIDSettingsOK struct {

	/*
	  In: Body
	*/
	Payload interface{} `json:"body,omitempty"`
}

// NewPutAPIV1UsersUserIDSettingsOK creates PutAPIV1UsersUserIDSettingsOK with default headers values
func NewPutAPIV1UsersUserIDSettingsOK() *PutAPIV1UsersUserIDSettingsOK {

	return &PutAPIV1UsersUserIDSettingsOK{}
}

// WithPayload adds the payload to the put Api v1 users user Id settings o k response
func (o *PutAPIV1UsersUserIDSettingsOK) WithPayload(payload interface{}) *PutAPIV1UsersUserIDSettingsOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the put Api v1 users user Id settings o k response
func (o *PutAPIV1UsersUserIDSettingsOK) SetPayload(payload interface{}) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PutAPIV1UsersUserIDSettingsOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	payload := o.Payload
	if err := producer.Produce(rw, payload); err != nil {
		panic(err) // let the recovery middleware deal with this
	}
}