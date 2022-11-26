// Code generated by go-swagger; DO NOT EDIT.

package operations

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/loads"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/runtime/security"
	"github.com/go-openapi/spec"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"

	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/administrations"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/friendships"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/posts"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/users"
)

// NewShapparAPI creates a new Shappar instance
func NewShapparAPI(spec *loads.Document) *ShapparAPI {
	return &ShapparAPI{
		handlers:            make(map[string]map[string]http.Handler),
		formats:             strfmt.Default,
		defaultConsumes:     "application/json",
		defaultProduces:     "application/json",
		customConsumers:     make(map[string]runtime.Consumer),
		customProducers:     make(map[string]runtime.Producer),
		PreServerShutdown:   func() {},
		ServerShutdown:      func() {},
		spec:                spec,
		useSwaggerUI:        false,
		ServeError:          errors.ServeError,
		BasicAuthenticator:  security.BasicAuth,
		APIKeyAuthenticator: security.APIKeyAuth,
		BearerAuthenticator: security.BearerAuth,

		JSONConsumer: runtime.JSONConsumer(),

		JSONProducer: runtime.JSONProducer(),

		FriendshipsDeleteAPIV1FriendshipsUserIDHandler: friendships.DeleteAPIV1FriendshipsUserIDHandlerFunc(func(params friendships.DeleteAPIV1FriendshipsUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.DeleteAPIV1FriendshipsUserID has not yet been implemented")
		}),
		PostsDeleteAPIV1PostsPostIDHandler: posts.DeleteAPIV1PostsPostIDHandlerFunc(func(params posts.DeleteAPIV1PostsPostIDParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.DeleteAPIV1PostsPostID has not yet been implemented")
		}),
		UsersDeleteAPIV1UsersUserIDHandler: users.DeleteAPIV1UsersUserIDHandlerFunc(func(params users.DeleteAPIV1UsersUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation users.DeleteAPIV1UsersUserID has not yet been implemented")
		}),
		FriendshipsGetAPIV1FrendshipsUserIDFollowersHandler: friendships.GetAPIV1FrendshipsUserIDFollowersHandlerFunc(func(params friendships.GetAPIV1FrendshipsUserIDFollowersParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.GetAPIV1FrendshipsUserIDFollowers has not yet been implemented")
		}),
		FriendshipsGetAPIV1FrendshipsUserIDFollowingHandler: friendships.GetAPIV1FrendshipsUserIDFollowingHandlerFunc(func(params friendships.GetAPIV1FrendshipsUserIDFollowingParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.GetAPIV1FrendshipsUserIDFollowing has not yet been implemented")
		}),
		AdministrationsGetAPIV1HealthHandler: administrations.GetAPIV1HealthHandlerFunc(func(params administrations.GetAPIV1HealthParams) middleware.Responder {
			return middleware.NotImplemented("operation administrations.GetAPIV1Health has not yet been implemented")
		}),
		PostsGetAPIV1PostsPostIDHandler: posts.GetAPIV1PostsPostIDHandlerFunc(func(params posts.GetAPIV1PostsPostIDParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPostID has not yet been implemented")
		}),
		PostsGetAPIV1PostsPrivateHandler: posts.GetAPIV1PostsPrivateHandlerFunc(func(params posts.GetAPIV1PostsPrivateParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPrivate has not yet been implemented")
		}),
		PostsGetAPIV1PostsPublicHandler: posts.GetAPIV1PostsPublicHandlerFunc(func(params posts.GetAPIV1PostsPublicParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPublic has not yet been implemented")
		}),
		PostsGetAPIV1PostsPublicPostIDHandler: posts.GetAPIV1PostsPublicPostIDHandlerFunc(func(params posts.GetAPIV1PostsPublicPostIDParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPublicPostID has not yet been implemented")
		}),
		PostsGetAPIV1PostsPublicRankHandler: posts.GetAPIV1PostsPublicRankHandlerFunc(func(params posts.GetAPIV1PostsPublicRankParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPublicRank has not yet been implemented")
		}),
		UsersGetAPIV1UsersHandler: users.GetAPIV1UsersHandlerFunc(func(params users.GetAPIV1UsersParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1Users has not yet been implemented")
		}),
		UsersGetAPIV1UsersUserIDHandler: users.GetAPIV1UsersUserIDHandlerFunc(func(params users.GetAPIV1UsersUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1UsersUserID has not yet been implemented")
		}),
		UsersGetAPIV1UsersUserIDPostedHandler: users.GetAPIV1UsersUserIDPostedHandlerFunc(func(params users.GetAPIV1UsersUserIDPostedParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1UsersUserIDPosted has not yet been implemented")
		}),
		UsersGetAPIV1UsersUserIDSettingsHandler: users.GetAPIV1UsersUserIDSettingsHandlerFunc(func(params users.GetAPIV1UsersUserIDSettingsParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1UsersUserIDSettings has not yet been implemented")
		}),
		UsersGetAPIV1UsersUserIDVotedHandler: users.GetAPIV1UsersUserIDVotedHandlerFunc(func(params users.GetAPIV1UsersUserIDVotedParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1UsersUserIDVoted has not yet been implemented")
		}),
		UsersPatchAPIV1UsersUserIDHandler: users.PatchAPIV1UsersUserIDHandlerFunc(func(params users.PatchAPIV1UsersUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation users.PatchAPIV1UsersUserID has not yet been implemented")
		}),
		FriendshipsPostAPIV1FriendshipsUserIDHandler: friendships.PostAPIV1FriendshipsUserIDHandlerFunc(func(params friendships.PostAPIV1FriendshipsUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.PostAPIV1FriendshipsUserID has not yet been implemented")
		}),
		PostsPostAPIV1PostsHandler: posts.PostAPIV1PostsHandlerFunc(func(params posts.PostAPIV1PostsParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.PostAPIV1Posts has not yet been implemented")
		}),
		PostsPostAPIV1PostsPostIDPollsHandler: posts.PostAPIV1PostsPostIDPollsHandlerFunc(func(params posts.PostAPIV1PostsPostIDPollsParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.PostAPIV1PostsPostIDPolls has not yet been implemented")
		}),
		UsersPostAPIV1UsersHandler: users.PostAPIV1UsersHandlerFunc(func(params users.PostAPIV1UsersParams) middleware.Responder {
			return middleware.NotImplemented("operation users.PostAPIV1Users has not yet been implemented")
		}),
		FriendshipsPutAPIV1FriendshipsUserIDHandler: friendships.PutAPIV1FriendshipsUserIDHandlerFunc(func(params friendships.PutAPIV1FriendshipsUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.PutAPIV1FriendshipsUserID has not yet been implemented")
		}),
		UsersPutAPIV1UsersUserIDSettingsHandler: users.PutAPIV1UsersUserIDSettingsHandlerFunc(func(params users.PutAPIV1UsersUserIDSettingsParams) middleware.Responder {
			return middleware.NotImplemented("operation users.PutAPIV1UsersUserIDSettings has not yet been implemented")
		}),
	}
}

/*ShapparAPI shappar api */
type ShapparAPI struct {
	spec            *loads.Document
	context         *middleware.Context
	handlers        map[string]map[string]http.Handler
	formats         strfmt.Registry
	customConsumers map[string]runtime.Consumer
	customProducers map[string]runtime.Producer
	defaultConsumes string
	defaultProduces string
	Middleware      func(middleware.Builder) http.Handler
	useSwaggerUI    bool

	// BasicAuthenticator generates a runtime.Authenticator from the supplied basic auth function.
	// It has a default implementation in the security package, however you can replace it for your particular usage.
	BasicAuthenticator func(security.UserPassAuthentication) runtime.Authenticator

	// APIKeyAuthenticator generates a runtime.Authenticator from the supplied token auth function.
	// It has a default implementation in the security package, however you can replace it for your particular usage.
	APIKeyAuthenticator func(string, string, security.TokenAuthentication) runtime.Authenticator

	// BearerAuthenticator generates a runtime.Authenticator from the supplied bearer token auth function.
	// It has a default implementation in the security package, however you can replace it for your particular usage.
	BearerAuthenticator func(string, security.ScopedTokenAuthentication) runtime.Authenticator

	// JSONConsumer registers a consumer for the following mime types:
	//   - application/json
	JSONConsumer runtime.Consumer

	// JSONProducer registers a producer for the following mime types:
	//   - application/json
	JSONProducer runtime.Producer

	// FriendshipsDeleteAPIV1FriendshipsUserIDHandler sets the operation handler for the delete API v1 friendships user ID operation
	FriendshipsDeleteAPIV1FriendshipsUserIDHandler friendships.DeleteAPIV1FriendshipsUserIDHandler
	// PostsDeleteAPIV1PostsPostIDHandler sets the operation handler for the delete API v1 posts post ID operation
	PostsDeleteAPIV1PostsPostIDHandler posts.DeleteAPIV1PostsPostIDHandler
	// UsersDeleteAPIV1UsersUserIDHandler sets the operation handler for the delete API v1 users user ID operation
	UsersDeleteAPIV1UsersUserIDHandler users.DeleteAPIV1UsersUserIDHandler
	// FriendshipsGetAPIV1FrendshipsUserIDFollowersHandler sets the operation handler for the get API v1 frendships user ID followers operation
	FriendshipsGetAPIV1FrendshipsUserIDFollowersHandler friendships.GetAPIV1FrendshipsUserIDFollowersHandler
	// FriendshipsGetAPIV1FrendshipsUserIDFollowingHandler sets the operation handler for the get API v1 frendships user ID following operation
	FriendshipsGetAPIV1FrendshipsUserIDFollowingHandler friendships.GetAPIV1FrendshipsUserIDFollowingHandler
	// AdministrationsGetAPIV1HealthHandler sets the operation handler for the get API v1 health operation
	AdministrationsGetAPIV1HealthHandler administrations.GetAPIV1HealthHandler
	// PostsGetAPIV1PostsPostIDHandler sets the operation handler for the get API v1 posts post ID operation
	PostsGetAPIV1PostsPostIDHandler posts.GetAPIV1PostsPostIDHandler
	// PostsGetAPIV1PostsPrivateHandler sets the operation handler for the get API v1 posts private operation
	PostsGetAPIV1PostsPrivateHandler posts.GetAPIV1PostsPrivateHandler
	// PostsGetAPIV1PostsPublicHandler sets the operation handler for the get API v1 posts public operation
	PostsGetAPIV1PostsPublicHandler posts.GetAPIV1PostsPublicHandler
	// PostsGetAPIV1PostsPublicPostIDHandler sets the operation handler for the get API v1 posts public post ID operation
	PostsGetAPIV1PostsPublicPostIDHandler posts.GetAPIV1PostsPublicPostIDHandler
	// PostsGetAPIV1PostsPublicRankHandler sets the operation handler for the get API v1 posts public rank operation
	PostsGetAPIV1PostsPublicRankHandler posts.GetAPIV1PostsPublicRankHandler
	// UsersGetAPIV1UsersHandler sets the operation handler for the get API v1 users operation
	UsersGetAPIV1UsersHandler users.GetAPIV1UsersHandler
	// UsersGetAPIV1UsersUserIDHandler sets the operation handler for the get API v1 users user ID operation
	UsersGetAPIV1UsersUserIDHandler users.GetAPIV1UsersUserIDHandler
	// UsersGetAPIV1UsersUserIDPostedHandler sets the operation handler for the get API v1 users user ID posted operation
	UsersGetAPIV1UsersUserIDPostedHandler users.GetAPIV1UsersUserIDPostedHandler
	// UsersGetAPIV1UsersUserIDSettingsHandler sets the operation handler for the get API v1 users user ID settings operation
	UsersGetAPIV1UsersUserIDSettingsHandler users.GetAPIV1UsersUserIDSettingsHandler
	// UsersGetAPIV1UsersUserIDVotedHandler sets the operation handler for the get API v1 users user ID voted operation
	UsersGetAPIV1UsersUserIDVotedHandler users.GetAPIV1UsersUserIDVotedHandler
	// UsersPatchAPIV1UsersUserIDHandler sets the operation handler for the patch API v1 users user ID operation
	UsersPatchAPIV1UsersUserIDHandler users.PatchAPIV1UsersUserIDHandler
	// FriendshipsPostAPIV1FriendshipsUserIDHandler sets the operation handler for the post API v1 friendships user ID operation
	FriendshipsPostAPIV1FriendshipsUserIDHandler friendships.PostAPIV1FriendshipsUserIDHandler
	// PostsPostAPIV1PostsHandler sets the operation handler for the post API v1 posts operation
	PostsPostAPIV1PostsHandler posts.PostAPIV1PostsHandler
	// PostsPostAPIV1PostsPostIDPollsHandler sets the operation handler for the post API v1 posts post ID polls operation
	PostsPostAPIV1PostsPostIDPollsHandler posts.PostAPIV1PostsPostIDPollsHandler
	// UsersPostAPIV1UsersHandler sets the operation handler for the post API v1 users operation
	UsersPostAPIV1UsersHandler users.PostAPIV1UsersHandler
	// FriendshipsPutAPIV1FriendshipsUserIDHandler sets the operation handler for the put API v1 friendships user ID operation
	FriendshipsPutAPIV1FriendshipsUserIDHandler friendships.PutAPIV1FriendshipsUserIDHandler
	// UsersPutAPIV1UsersUserIDSettingsHandler sets the operation handler for the put API v1 users user ID settings operation
	UsersPutAPIV1UsersUserIDSettingsHandler users.PutAPIV1UsersUserIDSettingsHandler

	// ServeError is called when an error is received, there is a default handler
	// but you can set your own with this
	ServeError func(http.ResponseWriter, *http.Request, error)

	// PreServerShutdown is called before the HTTP(S) server is shutdown
	// This allows for custom functions to get executed before the HTTP(S) server stops accepting traffic
	PreServerShutdown func()

	// ServerShutdown is called when the HTTP(S) server is shut down and done
	// handling all active connections and does not accept connections any more
	ServerShutdown func()

	// Custom command line argument groups with their descriptions
	CommandLineOptionsGroups []swag.CommandLineOptionsGroup

	// User defined logger function.
	Logger func(string, ...interface{})
}

// UseRedoc for documentation at /docs
func (o *ShapparAPI) UseRedoc() {
	o.useSwaggerUI = false
}

// UseSwaggerUI for documentation at /docs
func (o *ShapparAPI) UseSwaggerUI() {
	o.useSwaggerUI = true
}

// SetDefaultProduces sets the default produces media type
func (o *ShapparAPI) SetDefaultProduces(mediaType string) {
	o.defaultProduces = mediaType
}

// SetDefaultConsumes returns the default consumes media type
func (o *ShapparAPI) SetDefaultConsumes(mediaType string) {
	o.defaultConsumes = mediaType
}

// SetSpec sets a spec that will be served for the clients.
func (o *ShapparAPI) SetSpec(spec *loads.Document) {
	o.spec = spec
}

// DefaultProduces returns the default produces media type
func (o *ShapparAPI) DefaultProduces() string {
	return o.defaultProduces
}

// DefaultConsumes returns the default consumes media type
func (o *ShapparAPI) DefaultConsumes() string {
	return o.defaultConsumes
}

// Formats returns the registered string formats
func (o *ShapparAPI) Formats() strfmt.Registry {
	return o.formats
}

// RegisterFormat registers a custom format validator
func (o *ShapparAPI) RegisterFormat(name string, format strfmt.Format, validator strfmt.Validator) {
	o.formats.Add(name, format, validator)
}

// Validate validates the registrations in the ShapparAPI
func (o *ShapparAPI) Validate() error {
	var unregistered []string

	if o.JSONConsumer == nil {
		unregistered = append(unregistered, "JSONConsumer")
	}

	if o.JSONProducer == nil {
		unregistered = append(unregistered, "JSONProducer")
	}

	if o.FriendshipsDeleteAPIV1FriendshipsUserIDHandler == nil {
		unregistered = append(unregistered, "friendships.DeleteAPIV1FriendshipsUserIDHandler")
	}
	if o.PostsDeleteAPIV1PostsPostIDHandler == nil {
		unregistered = append(unregistered, "posts.DeleteAPIV1PostsPostIDHandler")
	}
	if o.UsersDeleteAPIV1UsersUserIDHandler == nil {
		unregistered = append(unregistered, "users.DeleteAPIV1UsersUserIDHandler")
	}
	if o.FriendshipsGetAPIV1FrendshipsUserIDFollowersHandler == nil {
		unregistered = append(unregistered, "friendships.GetAPIV1FrendshipsUserIDFollowersHandler")
	}
	if o.FriendshipsGetAPIV1FrendshipsUserIDFollowingHandler == nil {
		unregistered = append(unregistered, "friendships.GetAPIV1FrendshipsUserIDFollowingHandler")
	}
	if o.AdministrationsGetAPIV1HealthHandler == nil {
		unregistered = append(unregistered, "administrations.GetAPIV1HealthHandler")
	}
	if o.PostsGetAPIV1PostsPostIDHandler == nil {
		unregistered = append(unregistered, "posts.GetAPIV1PostsPostIDHandler")
	}
	if o.PostsGetAPIV1PostsPrivateHandler == nil {
		unregistered = append(unregistered, "posts.GetAPIV1PostsPrivateHandler")
	}
	if o.PostsGetAPIV1PostsPublicHandler == nil {
		unregistered = append(unregistered, "posts.GetAPIV1PostsPublicHandler")
	}
	if o.PostsGetAPIV1PostsPublicPostIDHandler == nil {
		unregistered = append(unregistered, "posts.GetAPIV1PostsPublicPostIDHandler")
	}
	if o.PostsGetAPIV1PostsPublicRankHandler == nil {
		unregistered = append(unregistered, "posts.GetAPIV1PostsPublicRankHandler")
	}
	if o.UsersGetAPIV1UsersHandler == nil {
		unregistered = append(unregistered, "users.GetAPIV1UsersHandler")
	}
	if o.UsersGetAPIV1UsersUserIDHandler == nil {
		unregistered = append(unregistered, "users.GetAPIV1UsersUserIDHandler")
	}
	if o.UsersGetAPIV1UsersUserIDPostedHandler == nil {
		unregistered = append(unregistered, "users.GetAPIV1UsersUserIDPostedHandler")
	}
	if o.UsersGetAPIV1UsersUserIDSettingsHandler == nil {
		unregistered = append(unregistered, "users.GetAPIV1UsersUserIDSettingsHandler")
	}
	if o.UsersGetAPIV1UsersUserIDVotedHandler == nil {
		unregistered = append(unregistered, "users.GetAPIV1UsersUserIDVotedHandler")
	}
	if o.UsersPatchAPIV1UsersUserIDHandler == nil {
		unregistered = append(unregistered, "users.PatchAPIV1UsersUserIDHandler")
	}
	if o.FriendshipsPostAPIV1FriendshipsUserIDHandler == nil {
		unregistered = append(unregistered, "friendships.PostAPIV1FriendshipsUserIDHandler")
	}
	if o.PostsPostAPIV1PostsHandler == nil {
		unregistered = append(unregistered, "posts.PostAPIV1PostsHandler")
	}
	if o.PostsPostAPIV1PostsPostIDPollsHandler == nil {
		unregistered = append(unregistered, "posts.PostAPIV1PostsPostIDPollsHandler")
	}
	if o.UsersPostAPIV1UsersHandler == nil {
		unregistered = append(unregistered, "users.PostAPIV1UsersHandler")
	}
	if o.FriendshipsPutAPIV1FriendshipsUserIDHandler == nil {
		unregistered = append(unregistered, "friendships.PutAPIV1FriendshipsUserIDHandler")
	}
	if o.UsersPutAPIV1UsersUserIDSettingsHandler == nil {
		unregistered = append(unregistered, "users.PutAPIV1UsersUserIDSettingsHandler")
	}

	if len(unregistered) > 0 {
		return fmt.Errorf("missing registration: %s", strings.Join(unregistered, ", "))
	}

	return nil
}

// ServeErrorFor gets a error handler for a given operation id
func (o *ShapparAPI) ServeErrorFor(operationID string) func(http.ResponseWriter, *http.Request, error) {
	return o.ServeError
}

// AuthenticatorsFor gets the authenticators for the specified security schemes
func (o *ShapparAPI) AuthenticatorsFor(schemes map[string]spec.SecurityScheme) map[string]runtime.Authenticator {
	return nil
}

// Authorizer returns the registered authorizer
func (o *ShapparAPI) Authorizer() runtime.Authorizer {
	return nil
}

// ConsumersFor gets the consumers for the specified media types.
// MIME type parameters are ignored here.
func (o *ShapparAPI) ConsumersFor(mediaTypes []string) map[string]runtime.Consumer {
	result := make(map[string]runtime.Consumer, len(mediaTypes))
	for _, mt := range mediaTypes {
		switch mt {
		case "application/json":
			result["application/json"] = o.JSONConsumer
		}

		if c, ok := o.customConsumers[mt]; ok {
			result[mt] = c
		}
	}
	return result
}

// ProducersFor gets the producers for the specified media types.
// MIME type parameters are ignored here.
func (o *ShapparAPI) ProducersFor(mediaTypes []string) map[string]runtime.Producer {
	result := make(map[string]runtime.Producer, len(mediaTypes))
	for _, mt := range mediaTypes {
		switch mt {
		case "application/json":
			result["application/json"] = o.JSONProducer
		}

		if p, ok := o.customProducers[mt]; ok {
			result[mt] = p
		}
	}
	return result
}

// HandlerFor gets a http.Handler for the provided operation method and path
func (o *ShapparAPI) HandlerFor(method, path string) (http.Handler, bool) {
	if o.handlers == nil {
		return nil, false
	}
	um := strings.ToUpper(method)
	if _, ok := o.handlers[um]; !ok {
		return nil, false
	}
	if path == "/" {
		path = ""
	}
	h, ok := o.handlers[um][path]
	return h, ok
}

// Context returns the middleware context for the shappar API
func (o *ShapparAPI) Context() *middleware.Context {
	if o.context == nil {
		o.context = middleware.NewRoutableContext(o.spec, o, nil)
	}

	return o.context
}

func (o *ShapparAPI) initHandlerCache() {
	o.Context() // don't care about the result, just that the initialization happened
	if o.handlers == nil {
		o.handlers = make(map[string]map[string]http.Handler)
	}

	if o.handlers["DELETE"] == nil {
		o.handlers["DELETE"] = make(map[string]http.Handler)
	}
	o.handlers["DELETE"]["/api/v1/friendships/{userId}"] = friendships.NewDeleteAPIV1FriendshipsUserID(o.context, o.FriendshipsDeleteAPIV1FriendshipsUserIDHandler)
	if o.handlers["DELETE"] == nil {
		o.handlers["DELETE"] = make(map[string]http.Handler)
	}
	o.handlers["DELETE"]["/api/v1/posts/{post_id}"] = posts.NewDeleteAPIV1PostsPostID(o.context, o.PostsDeleteAPIV1PostsPostIDHandler)
	if o.handlers["DELETE"] == nil {
		o.handlers["DELETE"] = make(map[string]http.Handler)
	}
	o.handlers["DELETE"]["/api/v1/users/{user_id}"] = users.NewDeleteAPIV1UsersUserID(o.context, o.UsersDeleteAPIV1UsersUserIDHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/frendships/{userId}/followers"] = friendships.NewGetAPIV1FrendshipsUserIDFollowers(o.context, o.FriendshipsGetAPIV1FrendshipsUserIDFollowersHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/frendships/{userId}/following"] = friendships.NewGetAPIV1FrendshipsUserIDFollowing(o.context, o.FriendshipsGetAPIV1FrendshipsUserIDFollowingHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/health"] = administrations.NewGetAPIV1Health(o.context, o.AdministrationsGetAPIV1HealthHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/posts/{post_id}"] = posts.NewGetAPIV1PostsPostID(o.context, o.PostsGetAPIV1PostsPostIDHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/posts/private"] = posts.NewGetAPIV1PostsPrivate(o.context, o.PostsGetAPIV1PostsPrivateHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/posts/public"] = posts.NewGetAPIV1PostsPublic(o.context, o.PostsGetAPIV1PostsPublicHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/posts/public/{post_id}"] = posts.NewGetAPIV1PostsPublicPostID(o.context, o.PostsGetAPIV1PostsPublicPostIDHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/posts/public/rank"] = posts.NewGetAPIV1PostsPublicRank(o.context, o.PostsGetAPIV1PostsPublicRankHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/users"] = users.NewGetAPIV1Users(o.context, o.UsersGetAPIV1UsersHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/users/{user_id}"] = users.NewGetAPIV1UsersUserID(o.context, o.UsersGetAPIV1UsersUserIDHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/users/{user_id}/posted"] = users.NewGetAPIV1UsersUserIDPosted(o.context, o.UsersGetAPIV1UsersUserIDPostedHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/users/{user_id}/settings"] = users.NewGetAPIV1UsersUserIDSettings(o.context, o.UsersGetAPIV1UsersUserIDSettingsHandler)
	if o.handlers["GET"] == nil {
		o.handlers["GET"] = make(map[string]http.Handler)
	}
	o.handlers["GET"]["/api/v1/users/{user_id}/voted"] = users.NewGetAPIV1UsersUserIDVoted(o.context, o.UsersGetAPIV1UsersUserIDVotedHandler)
	if o.handlers["PATCH"] == nil {
		o.handlers["PATCH"] = make(map[string]http.Handler)
	}
	o.handlers["PATCH"]["/api/v1/users/{user_id}"] = users.NewPatchAPIV1UsersUserID(o.context, o.UsersPatchAPIV1UsersUserIDHandler)
	if o.handlers["POST"] == nil {
		o.handlers["POST"] = make(map[string]http.Handler)
	}
	o.handlers["POST"]["/api/v1/friendships/{userId}"] = friendships.NewPostAPIV1FriendshipsUserID(o.context, o.FriendshipsPostAPIV1FriendshipsUserIDHandler)
	if o.handlers["POST"] == nil {
		o.handlers["POST"] = make(map[string]http.Handler)
	}
	o.handlers["POST"]["/api/v1/posts"] = posts.NewPostAPIV1Posts(o.context, o.PostsPostAPIV1PostsHandler)
	if o.handlers["POST"] == nil {
		o.handlers["POST"] = make(map[string]http.Handler)
	}
	o.handlers["POST"]["/api/v1/posts/{post_id}/polls"] = posts.NewPostAPIV1PostsPostIDPolls(o.context, o.PostsPostAPIV1PostsPostIDPollsHandler)
	if o.handlers["POST"] == nil {
		o.handlers["POST"] = make(map[string]http.Handler)
	}
	o.handlers["POST"]["/api/v1/users"] = users.NewPostAPIV1Users(o.context, o.UsersPostAPIV1UsersHandler)
	if o.handlers["PUT"] == nil {
		o.handlers["PUT"] = make(map[string]http.Handler)
	}
	o.handlers["PUT"]["/api/v1/friendships/{userId}"] = friendships.NewPutAPIV1FriendshipsUserID(o.context, o.FriendshipsPutAPIV1FriendshipsUserIDHandler)
	if o.handlers["PUT"] == nil {
		o.handlers["PUT"] = make(map[string]http.Handler)
	}
	o.handlers["PUT"]["/api/v1/users/{user_id}/settings"] = users.NewPutAPIV1UsersUserIDSettings(o.context, o.UsersPutAPIV1UsersUserIDSettingsHandler)
}

// Serve creates a http handler to serve the API over HTTP
// can be used directly in http.ListenAndServe(":8000", api.Serve(nil))
func (o *ShapparAPI) Serve(builder middleware.Builder) http.Handler {
	o.Init()

	if o.Middleware != nil {
		return o.Middleware(builder)
	}
	if o.useSwaggerUI {
		return o.context.APIHandlerSwaggerUI(builder)
	}
	return o.context.APIHandler(builder)
}

// Init allows you to just initialize the handler cache, you can then recompose the middleware as you see fit
func (o *ShapparAPI) Init() {
	if len(o.handlers) == 0 {
		o.initHandlerCache()
	}
}

// RegisterConsumer allows you to add (or override) a consumer for a media type.
func (o *ShapparAPI) RegisterConsumer(mediaType string, consumer runtime.Consumer) {
	o.customConsumers[mediaType] = consumer
}

// RegisterProducer allows you to add (or override) a producer for a media type.
func (o *ShapparAPI) RegisterProducer(mediaType string, producer runtime.Producer) {
	o.customProducers[mediaType] = producer
}

// AddMiddlewareFor adds a http middleware to existing handler
func (o *ShapparAPI) AddMiddlewareFor(method, path string, builder middleware.Builder) {
	um := strings.ToUpper(method)
	if path == "/" {
		path = ""
	}
	o.Init()
	if h, ok := o.handlers[um][path]; ok {
		o.handlers[method][path] = builder(h)
	}
}