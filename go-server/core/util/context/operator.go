package context

import (
	"context"
)

type operatorIDKey struct{}

func SetOperatorID(ctx context.Context, operatorID string) context.Context {
	return context.WithValue(ctx, operatorIDKey{}, operatorID)
}

func GetOperatorID(ctx context.Context) string {
	operatorID, _ := ctx.Value(operatorIDKey{}).(string)
	return operatorID
}
