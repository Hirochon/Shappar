package firebaseuser

import (
	"fmt"
	"time"
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
		return fmt.Errorf("検証日時が空です")
	}
	return nil
}

func NewFirebaseTokenVerificationVerifiedTime(value time.Time) (FirebaseTokenVerificationVerifiedTime, error) {
	if err := checkVerifiedTime(value); err != nil {
		return nil, err
	}
	return firebaseTokenVerificationVerifiedTime(value), nil
}
