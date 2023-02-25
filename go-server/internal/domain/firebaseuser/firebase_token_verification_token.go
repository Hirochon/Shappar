package firebaseuser

import "fmt"

type firebaseTokenVerificationToken string

type FirebaseTokenVerificationToken interface {
	String() string
}

func (f firebaseTokenVerificationToken) String() string {
	return string(f)
}

func checkToken(token string) error {
	if token == "" {
		return fmt.Errorf("トークンが空です")
	}
	return nil
}

func newFirebaseTokenVerificationToken(token string) (FirebaseTokenVerificationToken, error) {
	if err := checkToken(token); err != nil {
		return nil, err
	}
	return firebaseTokenVerificationToken(token), nil
}
