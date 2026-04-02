package code

type Code string

const (
	OK               Code = "ok"
	Unknown          Code = "unknown"
	InvalidArgument  Code = "invalid_argument"
	Unauthenticated  Code = "unauthenticated"
	PermissionDenied Code = "permission_denied"
	NotFound         Code = "not_found"
	AlreadyExists    Code = "already_exists"
	Canceled         Code = "canceled"
	Internal         Code = "internal"
)
