package firebaseuser

import (
	"context"
)

type IFirebaseUserRepository interface {
	VerifyIDToken(ctx context.Context, firebaseTokenVerification FirebaseTokenVerification) (string, string, error)
	Store(ctx context.Context, firebaseUser FirebaseUser) error
}
