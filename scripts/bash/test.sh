#!/usr/bin/env bash
set -e

cleanup() {
    docker-compose -f docker-compose.test.yml down
}

cleanup

cp ./env.test ./.env

COMPOSE_HTTP_TIMEOUT=120 docker-compose -f docker-compose.test.yml up -d --force-recreate

npm run test-api

cleanup
