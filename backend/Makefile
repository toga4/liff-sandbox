SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
MAKEFLAGS += --warn-undefined-variables
.DEFAULT_GOAL := help

.PHONY: $(shell egrep -o ^[a-zA-Z_-]+: $(MAKEFILE_LIST) | sed 's/://')

help:
	@echo 'Usage: make [target]'
	@echo 'Targets:'
	@egrep -o '^[a-zA-Z_-]+:' $(MAKEFILE_LIST) | perl -pe 's/^(.+):/    \1/'

build:
	docker buildx build . -t asia-northeast1-docker.pkg.dev/toga4-liff-sandbox/d/toga4-liff-sandbox

push:
	docker push asia-northeast1-docker.pkg.dev/toga4-liff-sandbox/d/toga4-liff-sandbox