run:
	go run ./cmd/go-server/main.go
test:
	mkdir -p .output
	go test ./internal/... -coverprofile=.output/coverage.out
	go tool cover -html=.output/coverage.out -o .output/coverage.html
migrate-up:
	sql-migrate up -config=./internal/infrastructure/migration/dbconfig.yml
migrate-up-dryrun:
	sql-migrate up -dryrun -config=./internal/infrastructure/migration/dbconfig.yml
migrate-down:
	sql-migrate down -config=./internal/infrastructure/migration/dbconfig.yml
migrate-down-dryrun:
	sql-migrate down -dryrun -config=./internal/infrastructure/migration/dbconfig.yml
migrate-status:
	sql-migrate status -config=./internal/infrastructure/migration/dbconfig.yml
sqlc-gen:
	sqlc generate -f ./internal/infrastructure/sqlc/sqlc.yml
sqlc-compile:
	sqlc compile -f ./internal/infrastructure/sqlc/sqlc.yml