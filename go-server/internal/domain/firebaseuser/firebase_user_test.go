package firebaseuser

import (
	"testing"
	"time"

	"github.com/oklog/ulid/v2"
)

func TestNewFirebaseUserSuccess(t *testing.T) {
	t.Parallel()
	type wantStruct struct {
		token        string
		verifiedTime time.Time
		id           ulid.ULID
		uid          string
		email        string
	}
	cases := []struct {
		scenario     string
		token        string
		verifiedTime time.Time
		id           string
		uid          string
		email        string
		want         wantStruct
	}{
		{
			scenario:     "正常系 正常な引数を渡す",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT3R3JTPNQ3KKKV3PHESX2V3",
			uid:          "validFirebaseUID",
			email:        "sample@gmail.com",
			want: wantStruct{
				token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
				verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
				id:           ulid.MustParse("01GT3R3JTPNQ3KKKV3PHESX2V3"),
				uid:          "validFirebaseUID",
				email:        "sample@gmail.com",
			},
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			firebaseTokenVerification, err := NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err != nil {
				t.Fatalf("責務外であるfirebaseTokenVerificationの作成に失敗した: %v", err)
			}
			firebaseUser, err := NewFirebaseUser(firebaseTokenVerification, c.id, c.uid, c.email)
			if err != nil {
				t.Errorf("FirebaseUserの作成に失敗した: %v", err)
			}
			if firebaseUser.Token().String() != c.want.token {
				t.Errorf("トークンが一致しません: got %v, want %v", firebaseUser.Token().String(), c.want.token)
			}
			if firebaseUser.VerifiedTime().Time() != c.want.verifiedTime {
				t.Errorf("検証時間が一致しません: got %v, want %v", firebaseUser.VerifiedTime().Time(), c.want.verifiedTime)
			}
			if firebaseUser.ID().ULID() != c.want.id {
				t.Errorf("IDが一致しません: got %v, want %v", firebaseUser.ID().ULID(), c.want.id)
			}
			if firebaseUser.ID().String() != c.want.id.String() {
				t.Errorf("IDの文字列表現が一致しません: got %v, want %v", firebaseUser.ID().String(), c.want.id.String())
			}
			if firebaseUser.UID().String() != c.want.uid {
				t.Errorf("UIDが一致しません: got %v, want %v", firebaseUser.UID().String(), c.want.uid)
			}
			if firebaseUser.Email().String() != c.want.email {
				t.Errorf("メールアドレスが一致しません: got %v, want %v", firebaseUser.Email().String(), c.want.email)
			}
		})
	}
}

func TestNewFirebaseUserFailed(t *testing.T) {
	t.Parallel()
	cases := []struct {
		scenario     string
		token        string
		verifiedTime time.Time
		id           string
		uid          string
		email        string
	}{
		{
			scenario:     "異常系 firebaseUserIDが不正な値の場合",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "invalid",
			uid:          "validFirebaseUID",
			email:        "example@gmail.com",
		},
		{
			scenario:     "異常系 firebaseUserUIDが空文字列の場合",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT3R3JTPNQ3KKKV3PHESX2V3",
			uid:          "",
			email:        "example@gmail.com",
		},
		{
			scenario:     "異常系 firebaseUserEmailが空な場合",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT3R3JTPNQ3KKKV3PHESX2V3",
			uid:          "validFirebaseUID",
			email:        "",
		},
		{
			scenario:     "異常系 firebaseUserEmailでドメインが不正な場合",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT3R3JTPNQ3KKKV3PHESX2V3",
			uid:          "validFirebaseUID",
			email:        "example@.com",
		},
		{
			scenario:     "異常系 firebaseUserEmailで@が無い場合",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT3R3JTPNQ3KKKV3PHESX2V3",
			uid:          "validFirebaseUID",
			email:        "example.com",
		},
		{
			scenario:     "異常系 firebaseUserEmailでユーザー名が空",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT3R3JTPNQ3KKKV3PHESX2V3",
			uid:          "validFirebaseUID",
			email:        "@example.com",
		},
		{
			scenario:     "異常系 firebaseUserEmailで@が2つある",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT3R3JTPNQ3KKKV3PHESX2V3",
			uid:          "validFirebaseUID",
			email:        "example@example@com",
		},
		{
			scenario:     "異常系 firebaseUserEmailでユーザー名が空",
			token:        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			verifiedTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.Local),
			id:           "01GT3R3JTPNQ3KKKV3PHESX2V3",
			uid:          "validFirebaseUID",
			email:        "@example.com",
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			firebaseTokenVerification, err := NewFirebaseTokenVerification(c.token, c.verifiedTime)
			if err != nil {
				t.Fatalf("責務外であるfirebaseTokenVerificationの作成に失敗した: %v", err)
			}
			_, err = NewFirebaseUser(firebaseTokenVerification, c.id, c.uid, c.email)
			if err == nil {
				t.Errorf("FirebaseUserの作成に失敗しなかった")
			}
		})
	}
}
