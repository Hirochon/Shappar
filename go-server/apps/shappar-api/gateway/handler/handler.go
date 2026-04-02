package handler

import (
	"net/http"

	"github.com/Hirochon/Shappar/apps/shappar-api/gateway/oas"
	"github.com/samber/do"
)

var _ oas.ServerInterface = (*Handler)(nil)

type Handler struct {
	oas.Unimplemented
	// uc usecase.Usecase
}

// PostAuthSign implements [oas.ServerInterface].
func (h *Handler) PostAuthSign(w http.ResponseWriter, r *http.Request, params oas.PostAuthSignParams) {
	panic("unimplemented")
}

// DeleteV1FriendshipsUserId implements [oas.ServerInterface].
func (h *Handler) DeleteV1FriendshipsUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// DeleteV1PostsPostId implements [oas.ServerInterface].
func (h *Handler) DeleteV1PostsPostId(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// DeleteV1UsersUserId implements [oas.ServerInterface].
func (h *Handler) DeleteV1UsersUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetV1FrendshipsUserIdFollowers implements [oas.ServerInterface].
func (h *Handler) GetV1FrendshipsUserIdFollowers(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetV1FrendshipsUserIdFollowing implements [oas.ServerInterface].
func (h *Handler) GetV1FrendshipsUserIdFollowing(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetV1Health implements [oas.ServerInterface].
func (h *Handler) GetV1Health(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// GetV1PostsPostId implements [oas.ServerInterface].
func (h *Handler) GetV1PostsPostId(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// GetV1PostsPrivate implements [oas.ServerInterface].
func (h *Handler) GetV1PostsPrivate(w http.ResponseWriter, r *http.Request, params oas.GetV1PostsPrivateParams) {
	panic("unimplemented")
}

// GetV1PostsPublic implements [oas.ServerInterface].
func (h *Handler) GetV1PostsPublic(w http.ResponseWriter, r *http.Request, params oas.GetV1PostsPublicParams) {
	panic("unimplemented")
}

// GetV1PostsPublicPostId implements [oas.ServerInterface].
func (h *Handler) GetV1PostsPublicPostId(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// GetV1PostsPublicRank implements [oas.ServerInterface].
func (h *Handler) GetV1PostsPublicRank(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// GetV1Users implements [oas.ServerInterface].
func (h *Handler) GetV1Users(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// GetV1UsersUserId implements [oas.ServerInterface].
func (h *Handler) GetV1UsersUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetV1UsersUserIdPosted implements [oas.ServerInterface].
func (h *Handler) GetV1UsersUserIdPosted(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetV1UsersUserIdSettings implements [oas.ServerInterface].
func (h *Handler) GetV1UsersUserIdSettings(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetV1UsersUserIdVoted implements [oas.ServerInterface].
func (h *Handler) GetV1UsersUserIdVoted(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PatchV1UsersUserId implements [oas.ServerInterface].
func (h *Handler) PatchV1UsersUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PostV1FriendshipsUserId implements [oas.ServerInterface].
func (h *Handler) PostV1FriendshipsUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PostV1Posts implements [oas.ServerInterface].
func (h *Handler) PostV1Posts(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// PostV1PostsPostIdPolls implements [oas.ServerInterface].
func (h *Handler) PostV1PostsPostIdPolls(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// PostV1Users implements [oas.ServerInterface].
func (h *Handler) PostV1Users(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// PutV1FriendshipsUserId implements [oas.ServerInterface].
func (h *Handler) PutV1FriendshipsUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PutV1UsersUserIdSettings implements [oas.ServerInterface].
func (h *Handler) PutV1UsersUserIdSettings(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

func New(i *do.Injector) (*Handler, error) {
	return &Handler{
		// uc: do.MustInvoke[usecase.Usecase](i),
	}, nil
}
