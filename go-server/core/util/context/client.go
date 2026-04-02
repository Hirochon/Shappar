package context

import "context"

type Client struct {
	IP        string
	UserAgent string
}

type clientKey struct{}

func SetClient(ctx context.Context, client *Client) context.Context {
	return context.WithValue(ctx, clientKey{}, client)
}

func GetClient(ctx context.Context) *Client {
	params, _ := ctx.Value(clientKey{}).(*Client)
	return params
}
