package firebaseuserinfrastructure

import (
	"context"
	"fmt"
	"net/http"

	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
	sqlc "github.com/Hirochon/Shappar/go-server/internal/infrastructure/sqlc/sqlcgenerate"
	"github.com/Hirochon/Shappar/go-server/internal/pkg/customerror"
)

func (f firebaseUserRepository) Store(ctx context.Context, firebaseUser firebaseuser.FirebaseUser) error {
	tx, err := f.planetScaleClient.Begin()
	if err != nil { // ここに入ってくるテストケースが考えられないため、テストは無し
		f.shapparLogger.Error(err, "トランザクションの開始に失敗しました", "requestID", ctx.Value("requestID"))
		return customerror.NewCustomError(http.StatusInternalServerError, fmt.Errorf("トランザクションの開始に失敗しました"))
	}
	qtx := sqlc.New(tx)
	if err := qtx.CreateFirebaseUser(ctx, sqlc.CreateFirebaseUserParams{
		ID:    firebaseUser.ID().String(),
		Uid:   firebaseUser.UID().String(),
		Email: firebaseUser.Email().String(),
	}); err != nil {
		f.shapparLogger.Error(err, "FirebaseUserの登録に失敗しました",
			"requestID", ctx.Value("requestID"),
			"requestFirebaseUserID", firebaseUser.ID().String(),
			"requestFirebaseUserUID", firebaseUser.UID().String(),
			"requestFirebaseUserEmail", firebaseUser.Email().String(),
		)
		if err := tx.Rollback(); err != nil { // ここに入ってくるテストケースが考えられないため、テストは無し
			f.shapparLogger.Error(err, "トランザクションのロールバックに失敗しました", "requestID", ctx.Value("requestID"))
		}
		return customerror.NewCustomError(http.StatusBadRequest, fmt.Errorf("FirebaseUserの登録に失敗しました"))
	}
	if err := qtx.CreateFirebaseTokenVerify(ctx, sqlc.CreateFirebaseTokenVerifyParams{
		FirebaseUserID: firebaseUser.ID().String(),
		Uid:            firebaseUser.UID().String(),
		Email:          firebaseUser.Email().String(),
		VerifiedTime:   firebaseUser.VerifiedTime().Time(),
	}); err != nil {
		f.shapparLogger.Error(err, "FirebaseTokenVerifyの登録に失敗しました",
			"requestID", ctx.Value("requestID"),
			"requestFirebaseUserID", firebaseUser.ID().String(),
			"requestFirebaseUserUID", firebaseUser.UID().String(),
			"requestFirebaseUserEmail", firebaseUser.Email().String(),
			"requestFirebaseUserVerifiedTime", firebaseUser.VerifiedTime().Time(),
		)
		if err := tx.Rollback(); err != nil { // ここに入ってくるテストケースが考えられないため、テストは無し
			f.shapparLogger.Error(err, "トランザクションのロールバックに失敗しました", "requestID", ctx.Value("requestID"))
		}
		return customerror.NewCustomError(http.StatusBadRequest, fmt.Errorf("FirebaseTokenVerifyの登録に失敗しました"))
	}
	if err := tx.Commit(); err != nil { // ここに入ってくるテストケースが考えられないため、テストは無し
		f.shapparLogger.Error(err, "トランザクションのコミットに失敗しました", "requestID", ctx.Value("requestID"))
		return customerror.NewCustomError(http.StatusInternalServerError, fmt.Errorf("トランザクションのコミットに失敗しました"))
	}
	return nil
}
