package firebaseuserinfrastructure

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
	"github.com/Hirochon/Shappar/go-server/internal/infrastructure/externalconnection/firebaseconnection"
	"github.com/Hirochon/Shappar/go-server/internal/infrastructure/externalconnection/planetscaleconnection"
	"github.com/Hirochon/Shappar/go-server/internal/pkg/logger"
	"github.com/oklog/ulid/v2"
)

func TestFirebaseUserRepositoryStoreSuccess(t *testing.T) {
	t.Parallel()
	ctx := context.Background()
	shapparLogger, err := logger.New()
	if err != nil {
		t.Fatalf("failed to create logger: %s", err)
	}
	planetScaleClient, err := planetscaleconnection.NewPlanetScaleClient(os.Getenv("MYSQL_USER"), os.Getenv("MYSQL_PASSWORD"), os.Getenv("MYSQL_HOST"), os.Getenv("MYSQL_DATABASE"), os.Getenv("MYSQL_EXTRA_PROPERTIES"))
	if err != nil {
		t.Fatalf("failed to create mock MySQL(PlaneScale) client: %s", err)
	}
	t.Cleanup(func() {
		err := planetScaleClient.Close()
		if err != nil {
			t.Fatalf("failed to close mysql client: %s", err)
		}
	})
	firebaseClient, err := firebaseconnection.NewMockFirebaseClient(ctx)
	if err != nil {
		t.Fatalf("failed to create mock firebase client: %s", err)
	}
	firebaseUserRepository := NewFirebaseUserRepository(firebaseClient, planetScaleClient, shapparLogger)
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
			err = firebaseUserRepository.Store(ctx, firebaseUser)
			if err != nil {
				t.Errorf("FirebaseUserの保存に失敗しました: %s", err)
			}
		})
	}
}

func TestFirebaseUserRepositoryStoreFailed(t *testing.T) {
	t.Parallel()
	ctx := context.Background()
	shapparLogger, err := logger.New()
	if err != nil {
		t.Fatalf("failed to create logger: %s", err)
	}
	planetScaleClient, err := planetscaleconnection.NewPlanetScaleClient(os.Getenv("MYSQL_USER"), os.Getenv("MYSQL_PASSWORD"), os.Getenv("MYSQL_HOST"), os.Getenv("MYSQL_DATABASE"), os.Getenv("MYSQL_EXTRA_PROPERTIES"))
	if err != nil {
		t.Fatalf("failed to create mock MySQL(PlaneScale) client: %s", err)
	}
	t.Cleanup(func() {
		err := planetScaleClient.Close()
		if err != nil {
			t.Fatalf("failed to close mysql client: %s", err)
		}
	})
	firebaseClient, err := firebaseconnection.NewMockFirebaseClient(ctx)
	if err != nil {
		t.Fatalf("failed to create mock firebase client: %s", err)
	}
	firebaseUserRepository := NewFirebaseUserRepository(firebaseClient, planetScaleClient, shapparLogger)
	cases := []struct {
		scenario     string
		token        string
		verifiedTime time.Time
		id           string
	}{
		{
			scenario:     "異常系 FirebaseTokenVerifyにてIDが重複している",
			token:        "validToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT6H9318BAD9SCRCGM7JDW5D",
		},
		{
			scenario:     "異常系 FirebaseUserのIDが重複している",
			token:        "validToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT6H9318C8HW8BCGAK0XERWA",
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
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
			err = firebaseUserRepository.Store(ctx, firebaseUser)
			if err == nil {
				t.Errorf("FirebaseUserの保存に失敗しませんでした")
			}
		})
	}
}
