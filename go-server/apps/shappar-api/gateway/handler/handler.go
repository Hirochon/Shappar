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

// DeleteApiV1FriendshipsUserId implements [oas.ServerInterface].
func (h *Handler) DeleteApiV1FriendshipsUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// DeleteApiV1PostsPostId implements [oas.ServerInterface].
func (h *Handler) DeleteApiV1PostsPostId(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// DeleteApiV1UsersUserId implements [oas.ServerInterface].
func (h *Handler) DeleteApiV1UsersUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetApiV1FrendshipsUserIdFollowers implements [oas.ServerInterface].
func (h *Handler) GetApiV1FrendshipsUserIdFollowers(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetApiV1FrendshipsUserIdFollowing implements [oas.ServerInterface].
func (h *Handler) GetApiV1FrendshipsUserIdFollowing(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetApiV1Health implements [oas.ServerInterface].
func (h *Handler) GetApiV1Health(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// GetApiV1PostsPostId implements [oas.ServerInterface].
func (h *Handler) GetApiV1PostsPostId(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// GetApiV1PostsPrivate implements [oas.ServerInterface].
func (h *Handler) GetApiV1PostsPrivate(w http.ResponseWriter, r *http.Request, params oas.GetApiV1PostsPrivateParams) {
	panic("unimplemented")
}

// GetApiV1PostsPublic implements [oas.ServerInterface].
func (h *Handler) GetApiV1PostsPublic(w http.ResponseWriter, r *http.Request, params oas.GetApiV1PostsPublicParams) {
	panic("unimplemented")
}

// GetApiV1PostsPublicPostId implements [oas.ServerInterface].
func (h *Handler) GetApiV1PostsPublicPostId(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// GetApiV1PostsPublicRank implements [oas.ServerInterface].
func (h *Handler) GetApiV1PostsPublicRank(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// GetApiV1Users implements [oas.ServerInterface].
func (h *Handler) GetApiV1Users(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// GetApiV1UsersUserId implements [oas.ServerInterface].
func (h *Handler) GetApiV1UsersUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetApiV1UsersUserIdPosted implements [oas.ServerInterface].
func (h *Handler) GetApiV1UsersUserIdPosted(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetApiV1UsersUserIdSettings implements [oas.ServerInterface].
func (h *Handler) GetApiV1UsersUserIdSettings(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// GetApiV1UsersUserIdVoted implements [oas.ServerInterface].
func (h *Handler) GetApiV1UsersUserIdVoted(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PatchApiV1UsersUserId implements [oas.ServerInterface].
func (h *Handler) PatchApiV1UsersUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PostApiV1FriendshipsUserId implements [oas.ServerInterface].
func (h *Handler) PostApiV1FriendshipsUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PostApiV1Posts implements [oas.ServerInterface].
func (h *Handler) PostApiV1Posts(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// PostApiV1PostsPostIdPolls implements [oas.ServerInterface].
func (h *Handler) PostApiV1PostsPostIdPolls(w http.ResponseWriter, r *http.Request, postId string) {
	panic("unimplemented")
}

// PostApiV1Users implements [oas.ServerInterface].
func (h *Handler) PostApiV1Users(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

// PutApiV1FriendshipsUserId implements [oas.ServerInterface].
func (h *Handler) PutApiV1FriendshipsUserId(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

// PutApiV1UsersUserIdSettings implements [oas.ServerInterface].
func (h *Handler) PutApiV1UsersUserIdSettings(w http.ResponseWriter, r *http.Request, userId string) {
	panic("unimplemented")
}

func New(i *do.Injector) (*Handler, error) {
	return &Handler{
		// uc: do.MustInvoke[usecase.Usecase](i),
	}, nil
}
