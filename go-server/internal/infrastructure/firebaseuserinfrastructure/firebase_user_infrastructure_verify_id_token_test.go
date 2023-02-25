package firebaseuserinfrastructure

import (
	"context"
	"os"
	"testing"

	"github.com/Hirochon/Shappar/go-server/internal/infrastructure/externalconnection/firebaseconnection"
	"github.com/Hirochon/Shappar/go-server/internal/infrastructure/externalconnection/planetscaleconnection"
	"github.com/Hirochon/Shappar/go-server/internal/pkg/logger"
)

func TestFirebaseUserRepositoryVerifyIDTokenSuccess(t *testing.T) {
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
		scenario  string
		token     string
		wantUID   string
		wantEmail string
	}{
		{
			scenario:  "正常系 正常なトークンで認証できる",
			token:     "constToken",
			wantUID:   "hogeUID",
			wantEmail: "sample@example.com",
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			uid, email, err := firebaseUserRepository.VerifyIDToken(ctx, c.token)
			if err != nil {
				t.Errorf("正しい引数に対して、エラーが発生しました: %s", err)
			}
			if uid != c.wantUID {
				t.Errorf("正しい引数に対して、UIDが一致しません: got %s, want %s", uid, c.wantUID)
			}
			if email != c.wantEmail {
				t.Errorf("正しい引数に対して、emailが一致しません: got %s, want %s", email, c.wantEmail)
			}
		})
	}
}

func TestFirebaseUserRepositoryVerifyIDTokenFailed(t *testing.T) {
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
		scenario string
		token    string
	}{
		{
			scenario: "異常系 異常なトークンでfirebase側でエラーが発生する",
			token:    "invalidToken",
		},
		{
			scenario: "異常系 firebaseから返ってきた値にemailが含まれていない",
			token:    "NoEmailToken",
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			_, _, err := firebaseUserRepository.VerifyIDToken(ctx, c.token)
			if err == nil {
				t.Errorf("異常な引数に対して、エラーが発生しませんでした")
			}
		})
	}
}
