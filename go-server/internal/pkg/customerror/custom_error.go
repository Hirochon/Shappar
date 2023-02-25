package customerror

type CustomError interface {
	Error() string
	StatusCode() int
}

type customError struct {
	err        string
	statusCode int
}

func (c customError) Error() string {
	return c.err
}

func (c customError) StatusCode() int {
	return c.statusCode
}

// レスポンスする際に、ステータスコードをパースして、レスポンスを返す
// https://go.dev/play/p/gJauI-USyCs
func NewCustomError(statusCode int, err error) error {
	return &customError{
		err:        err.Error(),
		statusCode: statusCode,
	}
}
