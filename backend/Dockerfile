# syntax=docker/dockerfile:1.4
FROM golang:1.19 as build

WORKDIR /go/src

COPY --link go.mod go.sum .
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download -x

COPY --link . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -o /app

FROM gcr.io/distroless/static:debug
COPY --from=build /app /app
ENTRYPOINT ["/app"]
