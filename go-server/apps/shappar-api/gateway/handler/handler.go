package handler

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/Hirochon/Shappar/apps/shappar-api/gateway/oas"
	"github.com/Hirochon/Shappar/core/util/log"
	"github.com/samber/do"
)

var _ oas.ServerInterface = (*Handler)(nil)

type Handler struct {
	oas.Unimplemented
	// uc usecase.Usecase
}

// PostAuthSign implements [oas.ServerInterface].
func (h *Handler) PostAuthSign(w http.ResponseWriter, r *http.Request, params oas.PostAuthSignParams) {
	log.Info(r.Context(), "PostAuthSign", slog.String("params", fmt.Sprintf("%+v", params)))
	panic("unimplemented")
}

// DeleteFriendshipsUserId implements [oas.ServerInterface].
func (h *Handler) DeleteFriendshipsUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// DeletePostsPostId implements [oas.ServerInterface].
func (h *Handler) DeletePostsPostId(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// DeleteUsersUserId implements [oas.ServerInterface].
func (h *Handler) DeleteUsersUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetFrendshipsUserIdFollowers implements [oas.ServerInterface].
func (h *Handler) GetFrendshipsUserIdFollowers(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetFrendshipsUserIdFollowing implements [oas.ServerInterface].
func (h *Handler) GetFrendshipsUserIdFollowing(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetHealth implements [oas.ServerInterface].
func (h *Handler) GetHealth(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// GetPostsPostId implements [oas.ServerInterface].
func (h *Handler) GetPostsPostId(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// GetPostsPrivate implements [oas.ServerInterface].
func (h *Handler) GetPostsPrivate(w http.ResponseWriter, r *http.Request, params oas.GetPostsPrivateParams) {
	panic("unimplemented")
}

// GetPostsPublic implements [oas.ServerInterface].
func (h *Handler) GetPostsPublic(w http.ResponseWriter, r *http.Request, params oas.GetPostsPublicParams) {
	panic("unimplemented")
}

// GetPostsPublicPostId implements [oas.ServerInterface].
func (h *Handler) GetPostsPublicPostId(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// GetPostsPublicRank implements [oas.ServerInterface].
func (h *Handler) GetPostsPublicRank(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// GetUsers implements [oas.ServerInterface].
func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// GetUsersUserId implements [oas.ServerInterface].
func (h *Handler) GetUsersUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetUsersUserIdPosted implements [oas.ServerInterface].
func (h *Handler) GetUsersUserIdPosted(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetUsersUserIdSettings implements [oas.ServerInterface].
func (h *Handler) GetUsersUserIdSettings(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetUsersUserIdVoted implements [oas.ServerInterface].
func (h *Handler) GetUsersUserIdVoted(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PatchUsersUserId implements [oas.ServerInterface].
func (h *Handler) PatchUsersUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PostFriendshipsUserId implements [oas.ServerInterface].
func (h *Handler) PostFriendshipsUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PostPosts implements [oas.ServerInterface].
func (h *Handler) PostPosts(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// PostPostsPostIdPolls implements [oas.ServerInterface].
func (h *Handler) PostPostsPostIdPolls(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// PostUsers implements [oas.ServerInterface].
func (h *Handler) PostUsers(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// PutFriendshipsUserId implements [oas.ServerInterface].
func (h *Handler) PutFriendshipsUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PutUsersUserIdSettings implements [oas.ServerInterface].
func (h *Handler) PutUsersUserIdSettings(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

func New(i *do.Injector) (*Handler, error) {
	return &Handler{
		// uc: do.MustInvoke[usecase.Usecase](i),
	}, nil
}
