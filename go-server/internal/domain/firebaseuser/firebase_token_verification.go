package firebaseuser

import "time"

type firebaseTokenVerification struct {
	token        FirebaseTokenVerificationToken
	verifiedTime FirebaseTokenVerificationVerifiedTime
}

type FirebaseTokenVerification interface {
	Token() FirebaseTokenVerificationToken
	VerifiedTime() FirebaseTokenVerificationVerifiedTime
}

func (f firebaseTokenVerification) Token() FirebaseTokenVerificationToken {
	return f.token
}

func (f firebaseTokenVerification) VerifiedTime() FirebaseTokenVerificationVerifiedTime {
	return f.verifiedTime
}

func NewFirebaseTokenVerification(token string, verifiedTime time.Time) (FirebaseTokenVerification, error) {
	firebaseTokenVerificationToken, err := newFirebaseTokenVerificationToken(token)
	if err != nil {
		return nil, err
	}
	firebaseTokenVerificationVerifiedTime, err := newFirebaseTokenVerificationVerifiedTime(verifiedTime)
	if err != nil {
		return nil, err
	}
	return &firebaseTokenVerification{
		token:        firebaseTokenVerificationToken,
		verifiedTime: firebaseTokenVerificationVerifiedTime,
	}, nil
}
