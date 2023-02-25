package firebaseuser

import (
	"fmt"
	"net/http"
	"regexp"

	"github.com/Hirochon/Shappar/go-server/internal/pkg/customerror"
)

type firebaseUserEmail string

type FirebaseUserEmail interface {
	String() string
}

func (f firebaseUserEmail) String() string {
	return string(f)
}

func checkEmail(value string) error {
	// 下記コードにて正規表現で不正なメールアドレスを弾く
	if !regexp.MustCompile(`^[a-zA-Z0-9.!#$%&'*+/=?^_` + "`" + `{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$`).MatchString(value) {
		return customerror.NewCustomError(http.StatusBadRequest, fmt.Errorf("メールアドレスが不正です"))
	}
	return nil
}

func newFirebaseUserEmail(value string) (FirebaseUserEmail, error) {
	if err := checkEmail(value); err != nil {
		return nil, err
	}
	return firebaseUserEmail(value), nil
}
