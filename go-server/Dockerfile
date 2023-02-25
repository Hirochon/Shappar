FROM golang:1.20.1-alpine3.17

ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG MYSQL_DATABASE
ARG MYSQL_HOST
ARG MYSQL_PROPERTIES

ENV MYSQL_USER $MYSQL_USER
ENV MYSQL_PASSWORD $MYSQL_PASSWORD
ENV MYSQL_DATABASE $MYSQL_DATABASE
ENV MYSQL_HOST $MYSQL_HOST
ENV MYSQL_PROPERTIES $MYSQL_PROPERTIES

WORKDIR /go/src/go-server
COPY . /go/src/go-server/

RUN apk update && \
    apk add --no-cache git gcc musl-dev make tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && \
    rm -rf /var/cache/apk/*

RUN go install golang.org/x/tools/gopls@latest && \
    go install github.com/go-delve/delve/cmd/dlv@latest && \
    go install github.com/kyleconroy/sqlc/cmd/sqlc@v1.14.0 && \
    go install github.com/rubenv/sql-migrate/...@v1.2.0

EXPOSE 8040
