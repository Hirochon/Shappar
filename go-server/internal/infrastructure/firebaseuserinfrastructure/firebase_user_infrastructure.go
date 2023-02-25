package firebaseuserinfrastructure

import (
	"database/sql"

	"github.com/Hirochon/Shappar/go-server/internal/domain/firebaseuser"
	"github.com/Hirochon/Shappar/go-server/internal/infrastructure/externalconnection/firebaseconnection"
	"github.com/go-logr/logr"
)

type firebaseUserRepository struct {
	planetScaleClient *sql.DB
	shapparLogger     *logr.Logger
	firebaseClient    firebaseconnection.FirebaseClient
}

func NewFirebaseUserRepository(firebaseClient firebaseconnection.FirebaseClient, planetScaleClient *sql.DB, ShapparLogger *logr.Logger) firebaseuser.IFirebaseUserRepository {
	firebaseUserLogger := ShapparLogger.WithName("firebaseUserRepository")
	return &firebaseUserRepository{
		planetScaleClient: planetScaleClient,
		shapparLogger:     &firebaseUserLogger,
		firebaseClient:    firebaseClient,
	}
}
