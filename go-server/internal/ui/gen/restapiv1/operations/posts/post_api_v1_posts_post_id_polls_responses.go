// Code generated by go-swagger; DO NOT EDIT.

package posts

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"
)

// PostAPIV1PostsPostIDPollsCreatedCode is the HTTP code returned for type PostAPIV1PostsPostIDPollsCreated
const PostAPIV1PostsPostIDPollsCreatedCode int = 201

/*
PostAPIV1PostsPostIDPollsCreated Created

swagger:response postApiV1PostsPostIdPollsCreated
*/
type PostAPIV1PostsPostIDPollsCreated struct {

	/*
	  In: Body
	*/
	Payload *PostAPIV1PostsPostIDPollsCreatedBody `json:"body,omitempty"`
}

// NewPostAPIV1PostsPostIDPollsCreated creates PostAPIV1PostsPostIDPollsCreated with default headers values
func NewPostAPIV1PostsPostIDPollsCreated() *PostAPIV1PostsPostIDPollsCreated {

	return &PostAPIV1PostsPostIDPollsCreated{}
}

// WithPayload adds the payload to the post Api v1 posts post Id polls created response
func (o *PostAPIV1PostsPostIDPollsCreated) WithPayload(payload *PostAPIV1PostsPostIDPollsCreatedBody) *PostAPIV1PostsPostIDPollsCreated {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the post Api v1 posts post Id polls created response
func (o *PostAPIV1PostsPostIDPollsCreated) SetPayload(payload *PostAPIV1PostsPostIDPollsCreatedBody) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PostAPIV1PostsPostIDPollsCreated) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(201)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// PostAPIV1PostsPostIDPollsBadRequestCode is the HTTP code returned for type PostAPIV1PostsPostIDPollsBadRequest
const PostAPIV1PostsPostIDPollsBadRequestCode int = 400

/*
PostAPIV1PostsPostIDPollsBadRequest Bad Request

swagger:response postApiV1PostsPostIdPollsBadRequest
*/
type PostAPIV1PostsPostIDPollsBadRequest struct {

	/*
	  In: Body
	*/
	Payload *PostAPIV1PostsPostIDPollsBadRequestBody `json:"body,omitempty"`
}

// NewPostAPIV1PostsPostIDPollsBadRequest creates PostAPIV1PostsPostIDPollsBadRequest with default headers values
func NewPostAPIV1PostsPostIDPollsBadRequest() *PostAPIV1PostsPostIDPollsBadRequest {

	return &PostAPIV1PostsPostIDPollsBadRequest{}
}

// WithPayload adds the payload to the post Api v1 posts post Id polls bad request response
func (o *PostAPIV1PostsPostIDPollsBadRequest) WithPayload(payload *PostAPIV1PostsPostIDPollsBadRequestBody) *PostAPIV1PostsPostIDPollsBadRequest {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the post Api v1 posts post Id polls bad request response
func (o *PostAPIV1PostsPostIDPollsBadRequest) SetPayload(payload *PostAPIV1PostsPostIDPollsBadRequestBody) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PostAPIV1PostsPostIDPollsBadRequest) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(400)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// PostAPIV1PostsPostIDPollsNotFoundCode is the HTTP code returned for type PostAPIV1PostsPostIDPollsNotFound
const PostAPIV1PostsPostIDPollsNotFoundCode int = 404

/*
PostAPIV1PostsPostIDPollsNotFound Not Found

swagger:response postApiV1PostsPostIdPollsNotFound
*/
type PostAPIV1PostsPostIDPollsNotFound struct {

	/*
	  In: Body
	*/
	Payload *PostAPIV1PostsPostIDPollsNotFoundBody `json:"body,omitempty"`
}

// NewPostAPIV1PostsPostIDPollsNotFound creates PostAPIV1PostsPostIDPollsNotFound with default headers values
func NewPostAPIV1PostsPostIDPollsNotFound() *PostAPIV1PostsPostIDPollsNotFound {

	return &PostAPIV1PostsPostIDPollsNotFound{}
}

// WithPayload adds the payload to the post Api v1 posts post Id polls not found response
func (o *PostAPIV1PostsPostIDPollsNotFound) WithPayload(payload *PostAPIV1PostsPostIDPollsNotFoundBody) *PostAPIV1PostsPostIDPollsNotFound {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the post Api v1 posts post Id polls not found response
func (o *PostAPIV1PostsPostIDPollsNotFound) SetPayload(payload *PostAPIV1PostsPostIDPollsNotFoundBody) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PostAPIV1PostsPostIDPollsNotFound) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(404)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
