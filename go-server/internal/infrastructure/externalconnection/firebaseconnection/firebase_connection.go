package firebaseconnection

import (
	"context"
	"fmt"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"github.com/oklog/ulid/v2"
	"google.golang.org/api/option"
)

type FirebaseClient interface {
	VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error)
}

type firebaseClient struct {
	auth *auth.Client
}

func (firebaseClient firebaseClient) VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
	return firebaseClient.auth.VerifyIDToken(ctx, idToken)
}

// credentialPath <- os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
func NewFirebaseClientWithCredential(ctx context.Context, credentialPath string) (FirebaseClient, error) {
	opt := option.WithCredentialsFile(credentialPath)
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return nil, err
	}
	client, err := app.Auth(ctx)
	if err != nil {
		return nil, err
	}
	return &firebaseClient{auth: client}, nil
}

// get credential cloudrun env
func NewFirebaseClient(ctx context.Context) (FirebaseClient, error) {
	app, err := firebase.NewApp(ctx, nil)
	if err != nil {
		return nil, err
	}
	client, err := app.Auth(ctx)
	if err != nil {
		return nil, err
	}
	return &firebaseClient{auth: client}, nil
}

type mockFirebaseClient struct {
	token *auth.Token
}

func (firebaseClient mockFirebaseClient) VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
	// テスト用の値を返す
	if idToken == "constToken" {
		return &auth.Token{
			UID: "hogeUID",
			Claims: map[string]interface{}{
				"email": "sample@example.com",
			},
		}, nil
	}
	if idToken == "constToken2" {
		return &auth.Token{
			UID: "01GJ4W5TTBC934D1VN6D9V7A33",
			Claims: map[string]interface{}{
				"email": "01GJ4W5TTBC934D1VN6D9V7A33@example.com",
			},
		}, nil
	}
	if idToken == "invalidToken" {
		return firebaseClient.token, fmt.Errorf("不正なfirebaseのtokenです")
	}
	if idToken == "NoEmailToken" {
		return &auth.Token{
			UID: ulid.Make().String(),
		}, nil
	}
	// それ以外はランダム値生成
	return &auth.Token{
		UID: ulid.Make().String(),
		Claims: map[string]interface{}{
			"email": ulid.Make().String() + "@example.com",
		},
	}, nil
}

func NewMockFirebaseClient(ctx context.Context) (FirebaseClient, error) {
	return &mockFirebaseClient{
		token: &auth.Token{},
	}, nil
}
