package code

type ShapparErrorOption interface {
	apply(*ShapparError)
}

func WithAttrs(attrs map[string]any) ShapparErrorOption {
	return withAttrs{attrs}
}

type withAttrs struct {
	attrs map[string]any
}

func (w withAttrs) apply(e *ShapparError) {
	if e.attrs == nil {
		e.attrs = make(map[string]any)
	}
	for k, v := range w.attrs {
		e.attrs[k] = v
	}
}

func WithAttr(key string, value any) ShapparErrorOption {
	return withAttribute{key, value}
}

type withAttribute struct {
	key   string
	value any
}

func (w withAttribute) apply(e *ShapparError) {
	if e.attrs == nil {
		e.attrs = make(map[string]any)
	}
	e.attrs[w.key] = w.value
}
