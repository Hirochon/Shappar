run:
	go run ./cmd/go-server/main.go
test:
	mkdir -p .output
	go test ./internal/... -coverprofile=.output/coverage.out
	go tool cover -html=.output/coverage.out -o .output/coverage.html