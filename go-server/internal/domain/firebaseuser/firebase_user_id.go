package firebaseuser

import (
	"fmt"
	"net/http"

	"github.com/Hirochon/Shappar/go-server/internal/pkg/customerror"
	"github.com/oklog/ulid/v2"
)

type firebaseUserID ulid.ULID

type FirebaseUserID interface {
	String() string
	ULID() ulid.ULID
}

func (f firebaseUserID) ULID() ulid.ULID {
	return ulid.ULID(f)
}

func (f firebaseUserID) String() string {
	return f.ULID().String()
}

func NewFirebaseUserID(id string) (FirebaseUserID, error) {
	ulid, err := ulid.Parse(id)
	if err != nil {
		return nil, customerror.NewCustomError(http.StatusBadRequest, fmt.Errorf("firebase user idが不正です: %w", err))
	}
	return firebaseUserID(ulid), nil
}
