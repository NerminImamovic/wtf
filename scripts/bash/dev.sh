#!/usr/bin/env bash
set -e

cleanup() {
  docker-compose -f docker-compose.local.yml down
}

cleanup

cp ./env.default ./.env

COMPOSE_HTTP_TIMEOUT=120 docker-compose -f docker-compose.local.yml up -d --force-recreate

npm run dev-server
