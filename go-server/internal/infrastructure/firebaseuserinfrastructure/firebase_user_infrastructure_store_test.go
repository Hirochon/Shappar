package firebaseuserinfrastructure

import (
	"errors"
	"testing"
	"time"

	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
	sqlc "github.com/Hirochon/Shappar/go-server/internal/infrastructure/sqlc/sqlcgenerate"
	"github.com/oklog/ulid/v2"
	"go.uber.org/mock/gomock"
)

func TestFirebaseUserRepositoryStoreSuccess(t *testing.T) {
	t.Parallel()
	cases := []struct {
		scenario     string
		token        string
		verifiedTime time.Time
	}{
		{
			scenario:     "正常系 正常なトークンで認証できる",
			token:        "validToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			repositoryTestRig := newTestFirebaseUserRepository(t)
			firebaseTokenVerification, err := firebaseuser.NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err != nil {
				t.Fatalf("NewFirebaseTokenVerificationで責務外のエラーが発生しました: %s", err)
			}
			uid, email, err := repositoryTestRig.repository.VerifyIDToken(repositoryTestRig.ctx, firebaseTokenVerification)
			if err != nil {
				t.Fatalf("VerifyIDTokenで責務外のエラーが発生しました: %s", err)
			}
			firebaseUser, err := firebaseuser.NewFirebaseUser(firebaseTokenVerification, ulid.Make().String(), uid, email)
			if err != nil {
				t.Fatalf("NewFirebaseUserで責務外のエラーが発生しました: %s", err)
			}

			gomock.InOrder(
				repositoryTestRig.txBeginner.EXPECT().Begin().Return(repositoryTestRig.tx, nil),
				repositoryTestRig.storeQueries.EXPECT().CreateFirebaseUser(repositoryTestRig.ctx, sqlc.CreateFirebaseUserParams{
					ID:    firebaseUser.ID().String(),
					Uid:   uid,
					Email: email,
				}).Return(nil),
				repositoryTestRig.storeQueries.EXPECT().CreateFirebaseTokenVerify(repositoryTestRig.ctx, sqlc.CreateFirebaseTokenVerifyParams{
					FirebaseUserID: firebaseUser.ID().String(),
					Uid:            uid,
					Email:          email,
					VerifiedTime:   firebaseUser.VerifiedTime().Time(),
				}).Return(nil),
				repositoryTestRig.tx.EXPECT().Commit().Return(nil),
			)

			err = repositoryTestRig.repository.Store(repositoryTestRig.ctx, firebaseUser)
			if err != nil {
				t.Errorf("FirebaseUserの保存に失敗しました: %s", err)
			}
		})
	}
}

func TestFirebaseUserRepositoryStoreFailed(t *testing.T) {
	t.Parallel()
	cases := []struct {
		scenario     string
		token        string
		verifiedTime time.Time
		id           string
		prepareMock  func(firebaseUserRepositoryTestRig, firebaseuser.FirebaseUser)
	}{
		{
			scenario:     "異常系 FirebaseTokenVerifyにてIDが重複している",
			token:        "validToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT6H9318BAD9SCRCGM7JDW5D",
			prepareMock: func(repositoryTestRig firebaseUserRepositoryTestRig, firebaseUser firebaseuser.FirebaseUser) {
				gomock.InOrder(
					repositoryTestRig.txBeginner.EXPECT().Begin().Return(repositoryTestRig.tx, nil),
					repositoryTestRig.storeQueries.EXPECT().CreateFirebaseUser(repositoryTestRig.ctx, sqlc.CreateFirebaseUserParams{
						ID:    firebaseUser.ID().String(),
						Uid:   firebaseUser.UID().String(),
						Email: firebaseUser.Email().String(),
					}).Return(nil),
					repositoryTestRig.storeQueries.EXPECT().CreateFirebaseTokenVerify(repositoryTestRig.ctx, sqlc.CreateFirebaseTokenVerifyParams{
						FirebaseUserID: firebaseUser.ID().String(),
						Uid:            firebaseUser.UID().String(),
						Email:          firebaseUser.Email().String(),
						VerifiedTime:   firebaseUser.VerifiedTime().Time(),
					}).Return(errors.New("duplicate firebase token verify")),
					repositoryTestRig.tx.EXPECT().Rollback().Return(nil),
				)
			},
		},
		{
			scenario:     "異常系 FirebaseUserのIDが重複している",
			token:        "validToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT6H9318C8HW8BCGAK0XERWA",
			prepareMock: func(repositoryTestRig firebaseUserRepositoryTestRig, firebaseUser firebaseuser.FirebaseUser) {
				gomock.InOrder(
					repositoryTestRig.txBeginner.EXPECT().Begin().Return(repositoryTestRig.tx, nil),
					repositoryTestRig.storeQueries.EXPECT().CreateFirebaseUser(repositoryTestRig.ctx, sqlc.CreateFirebaseUserParams{
						ID:    firebaseUser.ID().String(),
						Uid:   firebaseUser.UID().String(),
						Email: firebaseUser.Email().String(),
					}).Return(errors.New("duplicate firebase user")),
					repositoryTestRig.tx.EXPECT().Rollback().Return(nil),
				)
			},
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			repositoryTestRig := newTestFirebaseUserRepository(t)
			firebaseTokenVerification, err := firebaseuser.NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err != nil {
				t.Fatalf("NewFirebaseTokenVerificationで責務外のエラーが発生しました: %s", err)
			}
			uid, email, err := repositoryTestRig.repository.VerifyIDToken(repositoryTestRig.ctx, firebaseTokenVerification)
			if err != nil {
				t.Fatalf("VerifyIDTokenで責務外のエラーが発生しました: %s", err)
			}
			firebaseUser, err := firebaseuser.NewFirebaseUser(firebaseTokenVerification, c.id, uid, email)
			if err != nil {
				t.Fatalf("NewFirebaseUserで責務外のエラーが発生しました: %s", err)
			}
			c.prepareMock(repositoryTestRig, firebaseUser)
			err = repositoryTestRig.repository.Store(repositoryTestRig.ctx, firebaseUser)
			if err == nil {
				t.Errorf("FirebaseUserの保存に失敗しませんでした")
			}
		})
	}
}
