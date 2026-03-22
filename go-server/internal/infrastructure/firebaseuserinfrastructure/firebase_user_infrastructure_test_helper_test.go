package firebaseuserinfrastructure

import (
	"context"
	"database/sql"
	"testing"

	sqlmock "github.com/DATA-DOG/go-sqlmock"
	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
	"github.com/Hirochon/Shappar/go-server/internal/infrastructure/externalconnection/firebaseconnection"
	"github.com/Hirochon/Shappar/go-server/internal/pkg/logger"
)

func newTestFirebaseUserRepository(t *testing.T) (firebaseuser.IFirebaseUserRepository, *sql.DB, sqlmock.Sqlmock, context.Context) {
	t.Helper()

	ctx := context.Background()

	shapparLogger, err := logger.New()
	if err != nil {
		t.Fatalf("failed to create logger: %s", err)
	}

	planetScaleClient, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to create mock MySQL(PlanetScale) client: %s", err)
	}
	t.Cleanup(func() {
		mock.ExpectClose()
		if err := planetScaleClient.Close(); err != nil {
			t.Fatalf("failed to close mysql client: %s", err)
		}
		if err := mock.ExpectationsWereMet(); err != nil {
			t.Fatalf("sql expectations were not met: %s", err)
		}
	})

	firebaseClient, err := firebaseconnection.NewMockFirebaseClient(ctx)
	if err != nil {
		t.Fatalf("failed to create mock firebase client: %s", err)
	}

	return NewFirebaseUserRepository(firebaseClient, planetScaleClient, shapparLogger), planetScaleClient, mock, ctx
}
