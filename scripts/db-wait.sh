#!/bin/sh
set -eu

max_attempts="${DB_WAIT_MAX_ATTEMPTS:-30}"
attempt=1

while [ "$attempt" -le "$max_attempts" ]; do
  if docker-compose exec -T mariadb healthcheck.sh --connect --innodb_initialized >/dev/null 2>&1; then
    echo "MariaDB is healthy."
    exit 0
  fi

  echo "Waiting for MariaDB... ($attempt/$max_attempts)"
  attempt=$((attempt + 1))
  sleep 2
done

echo "MariaDB did not become healthy in time." >&2
exit 1
