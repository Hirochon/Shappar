package code

import (
	"errors"
	"fmt"
	"runtime/debug"
)

type ShapparError struct {
	code    Code
	message string
	origin  error
	stack   string
	attrs   map[string]any
}

func (e *ShapparError) Error() string {
	if e.origin == nil {
		return fmt.Sprintf("code: %s, message: %s", e.code, e.message)
	}
	return fmt.Sprintf("code: %s, message: %s, origin: %v", e.code, e.message, e.origin.Error())
}

// レスポンスで返すエラーメッセージは第二引数で、ログに出力する項目は第三引数以降のオプションで指定する
func NewError(c Code, msg string, opts ...ShapparErrorOption) error {
	if c == OK {
		return nil
	}

	e := &ShapparError{
		code:    c,
		message: msg,
		stack:   string(debug.Stack()),
	}
	for _, opt := range opts {
		opt.apply(e)
	}
	return e
}

// レスポンスで返すエラーメッセージは第二引数で、ログに出力する項目は第三引数以降のオプションで指定する
func WrapError(err error, c Code, msg string, opts ...ShapparErrorOption) error {
	if c == OK {
		return nil
	}

	stack := GetStack(err)
	if stack == "" {
		stack = string(debug.Stack())
	}

	e := &ShapparError{
		code:    c,
		message: msg,
		origin:  err,
		stack:   stack,
		attrs:   GetAttrs(err),
	}
	for _, opt := range opts {
		opt.apply(e)
	}
	return e
}

func UnwrapError(err error) error {
	if err == nil {
		return nil
	}
	var e *ShapparError
	if !errors.As(err, &e) {
		return err
	}
	return e.origin
}

func GetCode(err error) Code {
	if err == nil {
		return OK
	}
	var e *ShapparError
	if !errors.As(err, &e) {
		return Unknown
	}
	return e.code
}

func GetMessage(err error) string {
	if err == nil {
		return ""
	}
	var e *ShapparError
	if !errors.As(err, &e) {
		return err.Error()
	}
	return e.message
}

func GetStack(err error) string {
	if err == nil {
		return ""
	}
	var e *ShapparError
	if !errors.As(err, &e) {
		return ""
	}
	return e.stack
}

func GetAttrs(err error) map[string]any {
	if err == nil {
		return nil
	}
	var e *ShapparError
	if !errors.As(err, &e) {
		return nil
	}
	return e.attrs
}
