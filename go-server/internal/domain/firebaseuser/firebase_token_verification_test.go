package firebaseuser

import (
	"testing"
	"time"
)

func TestNewFirebaseTokenVerificationSuccess(t *testing.T) {
	t.Parallel()
	cases := []struct {
		scenario         string
		token            string
		verifiedTime     time.Time
		wantToken        string
		wantVerifiedTime time.Time
	}{
		{
			scenario:         "正常系 正常な引数を渡す",
			token:            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime:     time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			wantToken:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			wantVerifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			firebaseTokenVerification, err := NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err != nil {
				t.Errorf("FirebaseTokenVerificationの作成に失敗した: %v", err)
			}
			if firebaseTokenVerification.Token().String() != c.wantToken {
				t.Errorf("トークンが一致しません: got %v, want %v", firebaseTokenVerification.Token().String(), c.wantToken)
			}
			if firebaseTokenVerification.VerifiedTime().Time() != c.wantVerifiedTime {
				t.Errorf("検証日時が一致しません: got %v, want %v", firebaseTokenVerification.VerifiedTime().Time(), c.wantVerifiedTime)
			}
		})
	}
}

func TestNewFirebaseTokenVerificationFailed(t *testing.T) {
	t.Parallel()
	cases := []struct {
		scenario     string
		token        string
		verifiedTime time.Time
	}{
		{
			scenario:     "異常系 空文字のtokenを渡す",
			token:        "",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
		},
		{
			scenario:     "異常系 検証時間へゼロ値を代入する",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Time{},
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			_, err := NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err == nil {
				t.Errorf("FirebaseTokenVerificationの作成に失敗しなかった")
			}
		})
	}
}
