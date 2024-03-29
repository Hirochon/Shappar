// Code generated by go-swagger; DO NOT EDIT.

package posts

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/models"
)

// GetAPIV1PostsPublicOKCode is the HTTP code returned for type GetAPIV1PostsPublicOK
const GetAPIV1PostsPublicOKCode int = 200

/*
GetAPIV1PostsPublicOK OK

swagger:response getApiV1PostsPublicOK
*/
type GetAPIV1PostsPublicOK struct {

	/*
	  In: Body
	*/
	Payload *models.Posts `json:"body,omitempty"`
}

// NewGetAPIV1PostsPublicOK creates GetAPIV1PostsPublicOK with default headers values
func NewGetAPIV1PostsPublicOK() *GetAPIV1PostsPublicOK {

	return &GetAPIV1PostsPublicOK{}
}

// WithPayload adds the payload to the get Api v1 posts public o k response
func (o *GetAPIV1PostsPublicOK) WithPayload(payload *models.Posts) *GetAPIV1PostsPublicOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get Api v1 posts public o k response
func (o *GetAPIV1PostsPublicOK) SetPayload(payload *models.Posts) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetAPIV1PostsPublicOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// GetAPIV1PostsPublicNotFoundCode is the HTTP code returned for type GetAPIV1PostsPublicNotFound
const GetAPIV1PostsPublicNotFoundCode int = 404

/*
GetAPIV1PostsPublicNotFound Not Found

swagger:response getApiV1PostsPublicNotFound
*/
type GetAPIV1PostsPublicNotFound struct {

	/*
	  In: Body
	*/
	Payload *GetAPIV1PostsPublicNotFoundBody `json:"body,omitempty"`
}

// NewGetAPIV1PostsPublicNotFound creates GetAPIV1PostsPublicNotFound with default headers values
func NewGetAPIV1PostsPublicNotFound() *GetAPIV1PostsPublicNotFound {

	return &GetAPIV1PostsPublicNotFound{}
}

// WithPayload adds the payload to the get Api v1 posts public not found response
func (o *GetAPIV1PostsPublicNotFound) WithPayload(payload *GetAPIV1PostsPublicNotFoundBody) *GetAPIV1PostsPublicNotFound {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get Api v1 posts public not found response
func (o *GetAPIV1PostsPublicNotFound) SetPayload(payload *GetAPIV1PostsPublicNotFoundBody) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetAPIV1PostsPublicNotFound) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(404)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
