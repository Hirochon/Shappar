package firebaseuserinfrastructure

import (
	"testing"
	"time"

	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
)

func TestFirebaseUserRepositoryVerifyIDTokenSuccess(t *testing.T) {
	t.Parallel()
	cases := []struct {
		scenario     string
		token        string
		verifiedTime time.Time
		wantUID      string
		wantEmail    string
	}{
		{
			scenario:     "正常系 正常なトークンで認証できる",
			token:        "constToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			wantUID:      "hogeUID",
			wantEmail:    "sample@example.com",
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			firebaseUserRepository, _, _, ctx := newTestFirebaseUserRepository(t)
			firebaseTokenVerification, err := firebaseuser.NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err != nil {
				t.Fatalf("正しい引数に対して、責務外エラーが発生しました: %s", err)
			}
			uid, email, err := firebaseUserRepository.VerifyIDToken(ctx, firebaseTokenVerification)
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
	cases := []struct {
		scenario     string
		token        string
		verifiedTime time.Time
	}{
		{
			scenario:     "異常系 異常なトークンでfirebase側でエラーが発生する",
			token:        "invalidToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
		},
		{
			scenario:     "異常系 firebaseから返ってきた値にemailが含まれていない",
			token:        "NoEmailToken",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			firebaseUserRepository, _, _, ctx := newTestFirebaseUserRepository(t)
			firebaseTokenVerification, err := firebaseuser.NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err != nil {
				t.Fatalf("正しい引数に対して、責務外エラーが発生しました: %s", err)
			}
			_, _, err = firebaseUserRepository.VerifyIDToken(ctx, firebaseTokenVerification)
			if err == nil {
				t.Errorf("異常な引数に対して、エラーが発生しませんでした")
			}
		})
	}
}
