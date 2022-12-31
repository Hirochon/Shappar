// This file is safe to edit. Once it exists it will not be overwritten

package restapiv1

import (
	"crypto/tls"
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"

	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/friendships"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/posts"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/users"
)

//go:generate swagger generate server --target ../../gen --name Shappar --spec ../../../../../Swagger/swagger_api_v1.yml --server-package restapiv1 --principal interface{} --exclude-main

func configureFlags(api *operations.ShapparAPI) {
	// api.CommandLineOptionsGroups = []swag.CommandLineOptionsGroup{ ... }
}

func configureAPI(api *operations.ShapparAPI) http.Handler {
	// configure the api here
	api.ServeError = errors.ServeError

	// Set your custom logger if needed. Default one is log.Printf
	// Expected interface func(string, ...interface{})
	//
	// Example:
	// api.Logger = log.Printf

	api.UseSwaggerUI()
	// To continue using redoc as your UI, uncomment the following line
	// api.UseRedoc()

	api.JSONConsumer = runtime.JSONConsumer()

	api.JSONProducer = runtime.JSONProducer()

	if api.FriendshipsDeleteAPIV1FriendshipsUserIDHandler == nil {
		api.FriendshipsDeleteAPIV1FriendshipsUserIDHandler = friendships.DeleteAPIV1FriendshipsUserIDHandlerFunc(func(params friendships.DeleteAPIV1FriendshipsUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.DeleteAPIV1FriendshipsUserID has not yet been implemented")
		})
	}
	if api.PostsDeleteAPIV1PostsPostIDHandler == nil {
		api.PostsDeleteAPIV1PostsPostIDHandler = posts.DeleteAPIV1PostsPostIDHandlerFunc(func(params posts.DeleteAPIV1PostsPostIDParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.DeleteAPIV1PostsPostID has not yet been implemented")
		})
	}
	if api.UsersDeleteAPIV1UsersUserIDHandler == nil {
		api.UsersDeleteAPIV1UsersUserIDHandler = users.DeleteAPIV1UsersUserIDHandlerFunc(func(params users.DeleteAPIV1UsersUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation users.DeleteAPIV1UsersUserID has not yet been implemented")
		})
	}
	if api.FriendshipsGetAPIV1FrendshipsUserIDFollowersHandler == nil {
		api.FriendshipsGetAPIV1FrendshipsUserIDFollowersHandler = friendships.GetAPIV1FrendshipsUserIDFollowersHandlerFunc(func(params friendships.GetAPIV1FrendshipsUserIDFollowersParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.GetAPIV1FrendshipsUserIDFollowers has not yet been implemented")
		})
	}
	if api.FriendshipsGetAPIV1FrendshipsUserIDFollowingHandler == nil {
		api.FriendshipsGetAPIV1FrendshipsUserIDFollowingHandler = friendships.GetAPIV1FrendshipsUserIDFollowingHandlerFunc(func(params friendships.GetAPIV1FrendshipsUserIDFollowingParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.GetAPIV1FrendshipsUserIDFollowing has not yet been implemented")
		})
	}
	if api.PostsGetAPIV1PostsPostIDHandler == nil {
		api.PostsGetAPIV1PostsPostIDHandler = posts.GetAPIV1PostsPostIDHandlerFunc(func(params posts.GetAPIV1PostsPostIDParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPostID has not yet been implemented")
		})
	}
	if api.PostsGetAPIV1PostsPrivateHandler == nil {
		api.PostsGetAPIV1PostsPrivateHandler = posts.GetAPIV1PostsPrivateHandlerFunc(func(params posts.GetAPIV1PostsPrivateParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPrivate has not yet been implemented")
		})
	}
	if api.PostsGetAPIV1PostsPublicHandler == nil {
		api.PostsGetAPIV1PostsPublicHandler = posts.GetAPIV1PostsPublicHandlerFunc(func(params posts.GetAPIV1PostsPublicParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPublic has not yet been implemented")
		})
	}
	if api.PostsGetAPIV1PostsPublicPostIDHandler == nil {
		api.PostsGetAPIV1PostsPublicPostIDHandler = posts.GetAPIV1PostsPublicPostIDHandlerFunc(func(params posts.GetAPIV1PostsPublicPostIDParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPublicPostID has not yet been implemented")
		})
	}
	if api.PostsGetAPIV1PostsPublicRankHandler == nil {
		api.PostsGetAPIV1PostsPublicRankHandler = posts.GetAPIV1PostsPublicRankHandlerFunc(func(params posts.GetAPIV1PostsPublicRankParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.GetAPIV1PostsPublicRank has not yet been implemented")
		})
	}
	if api.UsersGetAPIV1UsersHandler == nil {
		api.UsersGetAPIV1UsersHandler = users.GetAPIV1UsersHandlerFunc(func(params users.GetAPIV1UsersParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1Users has not yet been implemented")
		})
	}
	if api.UsersGetAPIV1UsersUserIDHandler == nil {
		api.UsersGetAPIV1UsersUserIDHandler = users.GetAPIV1UsersUserIDHandlerFunc(func(params users.GetAPIV1UsersUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1UsersUserID has not yet been implemented")
		})
	}
	if api.UsersGetAPIV1UsersUserIDPostedHandler == nil {
		api.UsersGetAPIV1UsersUserIDPostedHandler = users.GetAPIV1UsersUserIDPostedHandlerFunc(func(params users.GetAPIV1UsersUserIDPostedParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1UsersUserIDPosted has not yet been implemented")
		})
	}
	if api.UsersGetAPIV1UsersUserIDSettingsHandler == nil {
		api.UsersGetAPIV1UsersUserIDSettingsHandler = users.GetAPIV1UsersUserIDSettingsHandlerFunc(func(params users.GetAPIV1UsersUserIDSettingsParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1UsersUserIDSettings has not yet been implemented")
		})
	}
	if api.UsersGetAPIV1UsersUserIDVotedHandler == nil {
		api.UsersGetAPIV1UsersUserIDVotedHandler = users.GetAPIV1UsersUserIDVotedHandlerFunc(func(params users.GetAPIV1UsersUserIDVotedParams) middleware.Responder {
			return middleware.NotImplemented("operation users.GetAPIV1UsersUserIDVoted has not yet been implemented")
		})
	}
	if api.UsersPatchAPIV1UsersUserIDHandler == nil {
		api.UsersPatchAPIV1UsersUserIDHandler = users.PatchAPIV1UsersUserIDHandlerFunc(func(params users.PatchAPIV1UsersUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation users.PatchAPIV1UsersUserID has not yet been implemented")
		})
	}
	if api.FriendshipsPostAPIV1FriendshipsUserIDHandler == nil {
		api.FriendshipsPostAPIV1FriendshipsUserIDHandler = friendships.PostAPIV1FriendshipsUserIDHandlerFunc(func(params friendships.PostAPIV1FriendshipsUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.PostAPIV1FriendshipsUserID has not yet been implemented")
		})
	}
	if api.PostsPostAPIV1PostsHandler == nil {
		api.PostsPostAPIV1PostsHandler = posts.PostAPIV1PostsHandlerFunc(func(params posts.PostAPIV1PostsParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.PostAPIV1Posts has not yet been implemented")
		})
	}
	if api.PostsPostAPIV1PostsPostIDPollsHandler == nil {
		api.PostsPostAPIV1PostsPostIDPollsHandler = posts.PostAPIV1PostsPostIDPollsHandlerFunc(func(params posts.PostAPIV1PostsPostIDPollsParams) middleware.Responder {
			return middleware.NotImplemented("operation posts.PostAPIV1PostsPostIDPolls has not yet been implemented")
		})
	}
	if api.UsersPostAPIV1UsersHandler == nil {
		api.UsersPostAPIV1UsersHandler = users.PostAPIV1UsersHandlerFunc(func(params users.PostAPIV1UsersParams) middleware.Responder {
			return middleware.NotImplemented("operation users.PostAPIV1Users has not yet been implemented")
		})
	}
	if api.FriendshipsPutAPIV1FriendshipsUserIDHandler == nil {
		api.FriendshipsPutAPIV1FriendshipsUserIDHandler = friendships.PutAPIV1FriendshipsUserIDHandlerFunc(func(params friendships.PutAPIV1FriendshipsUserIDParams) middleware.Responder {
			return middleware.NotImplemented("operation friendships.PutAPIV1FriendshipsUserID has not yet been implemented")
		})
	}
	if api.UsersPutAPIV1UsersUserIDSettingsHandler == nil {
		api.UsersPutAPIV1UsersUserIDSettingsHandler = users.PutAPIV1UsersUserIDSettingsHandlerFunc(func(params users.PutAPIV1UsersUserIDSettingsParams) middleware.Responder {
			return middleware.NotImplemented("operation users.PutAPIV1UsersUserIDSettings has not yet been implemented")
		})
	}

	api.PreServerShutdown = func() {}

	api.ServerShutdown = func() {}

	return setupGlobalMiddleware(api.Serve(setupMiddlewares))
}

// The TLS configuration before HTTPS server starts.
func configureTLS(tlsConfig *tls.Config) {
	// Make all necessary changes to the TLS configuration here.
}

// As soon as server is initialized but not run yet, this function will be called.
// If you need to modify a config, store server instance to stop it individually later, this is the place.
// This function can be called multiple times, depending on the number of serving schemes.
// scheme value will be set accordingly: "http", "https" or "unix".
func configureServer(s *http.Server, scheme, addr string) {
}

// The middleware configuration is for the handler executors. These do not apply to the swagger.json document.
// The middleware executes after routing but before authentication, binding and validation.
func setupMiddlewares(handler http.Handler) http.Handler {
	return handler
}

// The middleware configuration happens before anything, this middleware also applies to serving the swagger.json document.
// So this is a good place to plug in a panic handling middleware, logging and metrics.
func setupGlobalMiddleware(handler http.Handler) http.Handler {
	return handler
}
