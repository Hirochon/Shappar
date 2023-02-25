package firebaseuser

import (
	"fmt"
	"net/http"

	"github.com/Hirochon/Shappar/go-server/internal/pkg/customerror"
)

type firebaseTokenVerificationToken string

type FirebaseTokenVerificationToken interface {
	String() string
}

func (f firebaseTokenVerificationToken) String() string {
	return string(f)
}

func checkToken(token string) error {
	if token == "" {
		return customerror.NewCustomError(http.StatusBadRequest, fmt.Errorf("トークンが空です"))
	}
	return nil
}

func newFirebaseTokenVerificationToken(token string) (FirebaseTokenVerificationToken, error) {
	if err := checkToken(token); err != nil {
		return nil, err
	}
	return firebaseTokenVerificationToken(token), nil
}
