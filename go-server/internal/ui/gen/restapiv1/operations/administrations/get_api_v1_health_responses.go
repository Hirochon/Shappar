// Code generated by go-swagger; DO NOT EDIT.

package administrations

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/models"
)

// GetAPIV1HealthOKCode is the HTTP code returned for type GetAPIV1HealthOK
const GetAPIV1HealthOKCode int = 200

/*
GetAPIV1HealthOK HealthCheckをする

swagger:response getApiV1HealthOK
*/
type GetAPIV1HealthOK struct {

	/*
	  In: Body
	*/
	Payload *models.HealthCheck `json:"body,omitempty"`
}

// NewGetAPIV1HealthOK creates GetAPIV1HealthOK with default headers values
func NewGetAPIV1HealthOK() *GetAPIV1HealthOK {

	return &GetAPIV1HealthOK{}
}

// WithPayload adds the payload to the get Api v1 health o k response
func (o *GetAPIV1HealthOK) WithPayload(payload *models.HealthCheck) *GetAPIV1HealthOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get Api v1 health o k response
func (o *GetAPIV1HealthOK) SetPayload(payload *models.HealthCheck) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetAPIV1HealthOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
