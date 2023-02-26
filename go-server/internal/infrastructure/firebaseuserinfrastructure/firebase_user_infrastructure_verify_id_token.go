package firebaseuserinfrastructure

import (
	"context"
	"fmt"
	"net/http"

	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
	"github.com/Hirochon/Shappar/go-server/internal/pkg/customerror"
)

func (f firebaseUserRepository) VerifyIDToken(ctx context.Context, firebaseTokenVerification firebaseuser.FirebaseTokenVerification) (string, string, error) {
	token, err := f.firebaseClient.VerifyIDToken(ctx, firebaseTokenVerification.Token().String())
	if err != nil {
		return "", "", err
	}
	firebaseUserEmail, ok := token.Claims["email"].(string)
	if !ok {
		f.shapparLogger.Error(fmt.Errorf("firebase.claimsにemailが含まれていません"), "VerifyIDTokenに失敗しました", "requestID", ctx.Value("requestID"))
		return "", "", customerror.NewCustomError(http.StatusInternalServerError, fmt.Errorf("VerifyIDTokenに失敗しました"))
	}
	return token.UID, firebaseUserEmail, nil
}
