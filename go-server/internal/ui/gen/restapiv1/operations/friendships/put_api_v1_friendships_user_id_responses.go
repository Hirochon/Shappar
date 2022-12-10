// Code generated by go-swagger; DO NOT EDIT.

package friendships

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"
)

// PutAPIV1FriendshipsUserIDOKCode is the HTTP code returned for type PutAPIV1FriendshipsUserIDOK
const PutAPIV1FriendshipsUserIDOKCode int = 200

/*
PutAPIV1FriendshipsUserIDOK OK

swagger:response putApiV1FriendshipsUserIdOK
*/
type PutAPIV1FriendshipsUserIDOK struct {

	/*
	  In: Body
	*/
	Payload interface{} `json:"body,omitempty"`
}

// NewPutAPIV1FriendshipsUserIDOK creates PutAPIV1FriendshipsUserIDOK with default headers values
func NewPutAPIV1FriendshipsUserIDOK() *PutAPIV1FriendshipsUserIDOK {

	return &PutAPIV1FriendshipsUserIDOK{}
}

// WithPayload adds the payload to the put Api v1 friendships user Id o k response
func (o *PutAPIV1FriendshipsUserIDOK) WithPayload(payload interface{}) *PutAPIV1FriendshipsUserIDOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the put Api v1 friendships user Id o k response
func (o *PutAPIV1FriendshipsUserIDOK) SetPayload(payload interface{}) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PutAPIV1FriendshipsUserIDOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	payload := o.Payload
	if err := producer.Produce(rw, payload); err != nil {
		panic(err) // let the recovery middleware deal with this
	}
}