package ui

import "testing"

func TestServer(t *testing.T) {
	t.Parallel()
	cases := []struct {
		scenario, in, want string
	}{
		{
			scenario: "正常系: Hello World!!が作りたい",
			in:       "Hello",
			want:     "Hello World!!",
		},
	}
	for _, c := range cases {
		t.Run(c.scenario, func(t *testing.T) {
			got := Server(c.in)
			if got != c.want {
				t.Errorf("want %s, got %s", c.want, got)
			}
		})
	}
}
