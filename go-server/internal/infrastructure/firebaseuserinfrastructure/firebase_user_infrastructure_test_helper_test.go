package firebaseuserinfrastructure

import (
	"context"
	"testing"

	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
	"github.com/Hirochon/Shappar/go-server/internal/infrastructure/externalconnection/firebaseconnection"
	"github.com/Hirochon/Shappar/go-server/internal/pkg/logger"
	"go.uber.org/mock/gomock"
)

type firebaseUserRepositoryTestRig struct {
	repository   firebaseuser.IFirebaseUserRepository
	ctx          context.Context
	txBeginner   *MockFirebaseUserStoreTxBeginner
	tx           *MockFirebaseUserStoreTx
	storeQueries *MockFirebaseUserStoreQueries
}

func newTestFirebaseUserRepository(t *testing.T) firebaseUserRepositoryTestRig {
	t.Helper()

	ctrl := gomock.NewController(t)
	ctx := context.Background()

	shapparLogger, err := logger.New()
	if err != nil {
		t.Fatalf("failed to create logger: %s", err)
	}

	firebaseClient, err := firebaseconnection.NewMockFirebaseClient(ctx)
	if err != nil {
		t.Fatalf("failed to create mock firebase client: %s", err)
	}

	txBeginner := NewMockFirebaseUserStoreTxBeginner(ctrl)
	tx := NewMockFirebaseUserStoreTx(ctrl)
	storeQueries := NewMockFirebaseUserStoreQueries(ctrl)

	repository := newFirebaseUserRepository(
		firebaseClient,
		txBeginner,
		func(FirebaseUserStoreTx) FirebaseUserStoreQueries {
			return storeQueries
		},
		shapparLogger,
	)

	return firebaseUserRepositoryTestRig{
		repository:   repository,
		ctx:          ctx,
		txBeginner:   txBeginner,
		tx:           tx,
		storeQueries: storeQueries,
	}
}
