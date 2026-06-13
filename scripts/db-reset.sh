#!/bin/sh
set -eu

docker-compose down -v --remove-orphans
docker-compose up -d mariadb
sh scripts/db-wait.sh
sh scripts/db-init.sh
