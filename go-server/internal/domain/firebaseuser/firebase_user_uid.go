package firebaseuser

import (
	"fmt"
	"net/http"

	"github.com/Hirochon/Shappar/go-server/internal/pkg/customerror"
)

type firebaseUserUID string

type FirebaseUserUID interface {
	String() string
}

func (f firebaseUserUID) String() string {
	return string(f)
}

func checkFirebaseUID(value string) error {
	if value == "" {
		return customerror.NewCustomError(http.StatusBadRequest, fmt.Errorf("firebaseUserUIDが空です"))
	}
	return nil
}

func newFirebaseUserUID(value string) (FirebaseUserUID, error) {
	if err := checkFirebaseUID(value); err != nil {
		return nil, err
	}
	return firebaseUserUID(value), nil
}
