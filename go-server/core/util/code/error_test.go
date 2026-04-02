package code

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestShapparError_Error(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		err  *ShapparError
		want string
	}{
		{
			name: "no origin",
			err: &ShapparError{
				code:    Internal,
				message: "m",
			},
			want: "code: internal, message: m",
		},
		{
			name: "with origin",
			err: &ShapparError{
				code:    Internal,
				message: "m",
				origin:  errors.New("o"),
			},
			want: "code: internal, message: m, origin: o",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := tt.err.Error()
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestNewError(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name   string
		code   Code
		msg    string
		hasErr bool
		want   string
	}{
		{
			name:   "ok",
			code:   OK,
			msg:    "",
			hasErr: false,
		},
		{
			name:   "not ok",
			code:   Internal,
			msg:    "error",
			hasErr: true,
			want:   "code: internal, message: error",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := NewError(tt.code, tt.msg)
			assert.Equal(t, tt.hasErr, err != nil)
			if err != nil {
				assert.Equal(t, tt.want, err.Error())
			}
		})
	}
}

func TestWrapError(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name   string
		code   Code
		origin error
		msg    string
		hasErr bool
		want   string
	}{
		{
			name:   "ok",
			code:   OK,
			origin: nil,
			msg:    "",
			hasErr: false,
		},
		{
			name:   "not ok",
			code:   Internal,
			origin: errors.New("o"),
			msg:    "error",
			hasErr: true,
			want:   "code: internal, message: error, origin: o",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := WrapError(tt.origin, tt.code, tt.msg)
			assert.Equal(t, tt.hasErr, err != nil)
			if err != nil {
				assert.Equal(t, tt.want, err.Error())
			}
		})
	}
}

func TestUnwrapError(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name    string
		err     error
		hasErr  bool
		wantErr string
	}{
		{
			name:    "err nil",
			err:     nil,
			hasErr:  false,
			wantErr: "",
		},
		{
			name:    "not amphora error",
			err:     errors.New("error"),
			hasErr:  true,
			wantErr: "error",
		},
		{
			name:    "amphora error",
			err:     WrapError(errors.New("original error"), Unknown, "amphora error"),
			hasErr:  true,
			wantErr: "original error",
		},
	}
	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			err := UnwrapError(tt.err)
			assert.Equal(t, tt.hasErr, err != nil)
			if err != nil {
				assert.Equal(t, tt.wantErr, err.Error())
			}
		})
	}
}

func TestGetCode(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		err  error
		want Code
	}{
		{
			name: "nil",
			err:  nil,
			want: OK,
		},
		{
			name: "amphora error",
			err: &ShapparError{
				code: Internal,
			},
			want: Internal,
		},
		{
			name: "not amphora error",
			err:  errors.New("error"),
			want: Unknown,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := GetCode(tt.err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestGetMessage(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		err  error
		want string
	}{
		{
			name: "nil",
			err:  nil,
			want: "",
		},
		{
			name: "amphora error",
			err: &ShapparError{
				message: "m",
			},
			want: "m",
		},
		{
			name: "not amphora error",
			err:  errors.New("error"),
			want: "error",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := GetMessage(tt.err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestGetStack(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name     string
		err      error
		hasStack bool
	}{
		{
			name:     "nil",
			err:      nil,
			hasStack: false,
		},
		{
			name:     "amphora error",
			err:      NewError(Internal, "error"),
			hasStack: true,
		},
		{
			name:     "not amphora error",
			err:      errors.New("error"),
			hasStack: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := GetStack(tt.err)
			assert.Equal(t, tt.hasStack, got != "")
		})
	}
}

func TestGetAttrs(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		err  error
		want map[string]any
	}{
		{
			name: "nil",
			err:  nil,
			want: nil,
		},
		{
			name: "not amphora error",
			err:  errors.New("error"),
			want: nil,
		},
		{
			name: "new amphora error without attributes",
			err:  NewError(Internal, "error"),
			want: nil,
		},
		{
			name: "new amphora error with attributes",
			err: NewError(Internal, "error",
				WithAttr("key1", "value1"),
				WithAttr("key2", "value2"), // 上書きされる
				WithAttrs(map[string]any{
					"key2": 2, // 上書きする
					"key3": 3,
				})),
			want: map[string]any{
				"key1": "value1",
				"key2": 2,
				"key3": 3,
			},
		},
		{
			name: "wrap not amphora error with attributes",
			err: func() error {
				e := errors.New("error")
				return WrapError(e, Internal, "error",
					WithAttrs(map[string]any{
						"key1": "value1",
						"key2": "value2",
					}))
			}(),
			want: map[string]any{
				"key1": "value1",
				"key2": "value2",
			},
		},
		{
			name: "wrap amphora error with attributes",
			err: func() error {
				e := NewError(Internal, "e1",
					WithAttr("key1", "value1"),
					WithAttr("key2", "value2"), // 上書きされる
					WithAttrs(map[string]any{
						"key3": 3,
						"key4": 4, // 上書きされる
					}))
				return WrapError(e, Internal, "e2",
					WithAttr("key2", 2), // 上書きする
					WithAttr("key5", 5),
					WithAttrs(map[string]any{
						"key4": "value4", // 上書きする
						"key6": "value6",
					}))
			}(),
			want: map[string]any{
				"key1": "value1",
				"key2": 2,
				"key3": 3,
				"key4": "value4",
				"key5": 5,
				"key6": "value6",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := GetAttrs(tt.err)
			assert.Equal(t, tt.want, got)
		})
	}
}
