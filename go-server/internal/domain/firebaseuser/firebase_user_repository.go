package firebaseuser

import (
	"context"
)

type IFirebaseUserRepository interface {
	VerifyIDToken(ctx context.Context, idToken string) (string, string, error)
}
