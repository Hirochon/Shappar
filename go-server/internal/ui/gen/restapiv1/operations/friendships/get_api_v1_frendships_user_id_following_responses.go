// Code generated by go-swagger; DO NOT EDIT.

package friendships

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/models"
)

// GetAPIV1FrendshipsUserIDFollowingOKCode is the HTTP code returned for type GetAPIV1FrendshipsUserIDFollowingOK
const GetAPIV1FrendshipsUserIDFollowingOKCode int = 200

/*
GetAPIV1FrendshipsUserIDFollowingOK OK

swagger:response getApiV1FrendshipsUserIdFollowingOK
*/
type GetAPIV1FrendshipsUserIDFollowingOK struct {

	/*
	  In: Body
	*/
	Payload *models.Users `json:"body,omitempty"`
}

// NewGetAPIV1FrendshipsUserIDFollowingOK creates GetAPIV1FrendshipsUserIDFollowingOK with default headers values
func NewGetAPIV1FrendshipsUserIDFollowingOK() *GetAPIV1FrendshipsUserIDFollowingOK {

	return &GetAPIV1FrendshipsUserIDFollowingOK{}
}

// WithPayload adds the payload to the get Api v1 frendships user Id following o k response
func (o *GetAPIV1FrendshipsUserIDFollowingOK) WithPayload(payload *models.Users) *GetAPIV1FrendshipsUserIDFollowingOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get Api v1 frendships user Id following o k response
func (o *GetAPIV1FrendshipsUserIDFollowingOK) SetPayload(payload *models.Users) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetAPIV1FrendshipsUserIDFollowingOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
