package firebaseuser

import (
	"fmt"
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
		return fmt.Errorf("firebaseUserUIDが空です")
	}
	return nil
}

func newFirebaseUserUID(value string) (FirebaseUserUID, error) {
	if err := checkFirebaseUID(value); err != nil {
		return nil, err
	}
	return firebaseUserUID(value), nil
}
