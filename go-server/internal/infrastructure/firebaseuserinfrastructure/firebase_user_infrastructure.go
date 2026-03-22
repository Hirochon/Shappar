package firebaseuserinfrastructure

import (
	"context"
	"database/sql"

	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
	"github.com/Hirochon/Shappar/go-server/internal/infrastructure/externalconnection/firebaseconnection"
	sqlc "github.com/Hirochon/Shappar/go-server/internal/infrastructure/sqlc/sqlcgenerate"
	"github.com/go-logr/logr"
)

//go:generate go run go.uber.org/mock/mockgen@v0.6.0 -destination=mock_firebase_user_store_test.go -package=firebaseuserinfrastructure . FirebaseUserStoreTxBeginner,FirebaseUserStoreTx,FirebaseUserStoreQueries

type FirebaseUserStoreTx interface {
	sqlc.DBTX
	Commit() error
	Rollback() error
}

type FirebaseUserStoreTxBeginner interface {
	Begin() (FirebaseUserStoreTx, error)
}

type FirebaseUserStoreQueries interface {
	CreateFirebaseUser(context.Context, sqlc.CreateFirebaseUserParams) error
	CreateFirebaseTokenVerify(context.Context, sqlc.CreateFirebaseTokenVerifyParams) error
}

type sqlDBTxBeginner struct {
	db *sql.DB
}

func (s sqlDBTxBeginner) Begin() (FirebaseUserStoreTx, error) {
	return s.db.Begin()
}

type firebaseUserRepository struct {
	txBeginner      FirebaseUserStoreTxBeginner
	shapparLogger   *logr.Logger
	firebaseClient  firebaseconnection.FirebaseClient
	newStoreQueries func(FirebaseUserStoreTx) FirebaseUserStoreQueries
}

func NewFirebaseUserRepository(firebaseClient firebaseconnection.FirebaseClient, planetScaleClient *sql.DB, ShapparLogger *logr.Logger) firebaseuser.IFirebaseUserRepository {
	return newFirebaseUserRepository(
		firebaseClient,
		sqlDBTxBeginner{db: planetScaleClient},
		func(tx FirebaseUserStoreTx) FirebaseUserStoreQueries {
			return sqlc.New(tx)
		},
		ShapparLogger,
	)
}

func newFirebaseUserRepository(
	firebaseClient firebaseconnection.FirebaseClient,
	txBeginner FirebaseUserStoreTxBeginner,
	newStoreQueries func(FirebaseUserStoreTx) FirebaseUserStoreQueries,
	ShapparLogger *logr.Logger,
) firebaseuser.IFirebaseUserRepository {
	firebaseUserLogger := ShapparLogger.WithName("firebaseUserRepository")
	return &firebaseUserRepository{
		txBeginner:      txBeginner,
		shapparLogger:   &firebaseUserLogger,
		firebaseClient:  firebaseClient,
		newStoreQueries: newStoreQueries,
	}
}
