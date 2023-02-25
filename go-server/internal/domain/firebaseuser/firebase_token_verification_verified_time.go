package firebaseuser

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Hirochon/Shappar/go-server/internal/pkg/customerror"
)

type firebaseTokenVerificationVerifiedTime time.Time

type FirebaseTokenVerificationVerifiedTime interface {
	Time() time.Time
}

func (f firebaseTokenVerificationVerifiedTime) Time() time.Time {
	return time.Time(f)
}

func checkVerifiedTime(value time.Time) error {
	if value.IsZero() {
		return customerror.NewCustomError(http.StatusBadRequest, fmt.Errorf("検証日時が空です"))
	}
	return nil
}

func newFirebaseTokenVerificationVerifiedTime(value time.Time) (FirebaseTokenVerificationVerifiedTime, error) {
	if err := checkVerifiedTime(value); err != nil {
		return nil, err
	}
	return firebaseTokenVerificationVerifiedTime(value), nil
}
