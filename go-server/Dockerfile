FROM golang:1.19.3-alpine3.16

WORKDIR /go/src/go-server
COPY . /go/src/go-server/

RUN apk update && \
    apk add --no-cache git gcc musl-dev make tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && \
    rm -rf /var/cache/apk/*

RUN go install golang.org/x/tools/gopls@latest
    # go install github.com/kyleconroy/sqlc/cmd/sqlc@v1.14.0 && \
    # go install github.com/rubenv/sql-migrate/...@v1.2.0

EXPOSE 8040
