package firebaseuserinfrastructure

import (
	"errors"
	"testing"
	"time"

	sqlmock "github.com/DATA-DOG/go-sqlmock"
	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
	"github.com/oklog/ulid/v2"
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
			firebaseUserRepository, _, mock, ctx := newTestFirebaseUserRepository(t)
			firebaseTokenVerification, err := firebaseuser.NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err != nil {
				t.Fatalf("NewFirebaseTokenVerificationで責務外のエラーが発生しました: %s", err)
			}
			uid, email, err := firebaseUserRepository.VerifyIDToken(ctx, firebaseTokenVerification)
			if err != nil {
				t.Fatalf("VerifyIDTokenで責務外のエラーが発生しました: %s", err)
			}
			firebaseUser, err := firebaseuser.NewFirebaseUser(firebaseTokenVerification, ulid.Make().String(), uid, email)
			if err != nil {
				t.Fatalf("NewFirebaseUserで責務外のエラーが発生しました: %s", err)
			}
			mock.ExpectBegin()
			mock.ExpectExec("INSERT INTO `firebase_user`").
				WithArgs(firebaseUser.ID().String(), uid, email).
				WillReturnResult(sqlmock.NewResult(1, 1))
			mock.ExpectExec("INSERT INTO `firebase_token_verify`").
				WithArgs(firebaseUser.ID().String(), uid, email, firebaseUser.VerifiedTime().Time()).
				WillReturnResult(sqlmock.NewResult(1, 1))
			mock.ExpectCommit()
			err = firebaseUserRepository.Store(ctx, firebaseUser)
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
		prepareMock  func(sqlmock.Sqlmock, firebaseuser.FirebaseUser)
	}{
		{
			scenario:     "異常系 FirebaseTokenVerifyにてIDが重複している",
			token:        "validToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT6H9318BAD9SCRCGM7JDW5D",
			prepareMock: func(mock sqlmock.Sqlmock, firebaseUser firebaseuser.FirebaseUser) {
				mock.ExpectBegin()
				mock.ExpectExec("INSERT INTO `firebase_user`").
					WithArgs(firebaseUser.ID().String(), firebaseUser.UID().String(), firebaseUser.Email().String()).
					WillReturnResult(sqlmock.NewResult(1, 1))
				mock.ExpectExec("INSERT INTO `firebase_token_verify`").
					WithArgs(firebaseUser.ID().String(), firebaseUser.UID().String(), firebaseUser.Email().String(), firebaseUser.VerifiedTime().Time()).
					WillReturnError(errors.New("duplicate firebase token verify"))
				mock.ExpectRollback()
			},
		},
		{
			scenario:     "異常系 FirebaseUserのIDが重複している",
			token:        "validToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT6H9318C8HW8BCGAK0XERWA",
			prepareMock: func(mock sqlmock.Sqlmock, firebaseUser firebaseuser.FirebaseUser) {
				mock.ExpectBegin()
				mock.ExpectExec("INSERT INTO `firebase_user`").
					WithArgs(firebaseUser.ID().String(), firebaseUser.UID().String(), firebaseUser.Email().String()).
					WillReturnError(errors.New("duplicate firebase user"))
				mock.ExpectRollback()
			},
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			firebaseUserRepository, _, mock, ctx := newTestFirebaseUserRepository(t)
			firebaseTokenVerification, err := firebaseuser.NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err != nil {
				t.Fatalf("NewFirebaseTokenVerificationで責務外のエラーが発生しました: %s", err)
			}
			uid, email, err := firebaseUserRepository.VerifyIDToken(ctx, firebaseTokenVerification)
			if err != nil {
				t.Fatalf("VerifyIDTokenで責務外のエラーが発生しました: %s", err)
			}
			firebaseUser, err := firebaseuser.NewFirebaseUser(firebaseTokenVerification, c.id, uid, email)
			if err != nil {
				t.Fatalf("NewFirebaseUserで責務外のエラーが発生しました: %s", err)
			}
			c.prepareMock(mock, firebaseUser)
			err = firebaseUserRepository.Store(ctx, firebaseUser)
			if err == nil {
				t.Errorf("FirebaseUserの保存に失敗しませんでした")
			}
		})
	}
}
