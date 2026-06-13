#!/bin/sh
set -eu

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

root_password="${MARIADB_ROOT_PASSWORD:-root}"
database="${MARIADB_DATABASE:-jaubi_chat}"
shadow_database="${MARIADB_SHADOW_DATABASE:-jaubi_chat_shadow}"
user="${MARIADB_USER:-jaubi_chat}"
password="${MARIADB_PASSWORD:-jaubi_chat}"

docker-compose exec -T mariadb mariadb -uroot -p"$root_password" <<SQL
CREATE DATABASE IF NOT EXISTS \`$database\`;
CREATE DATABASE IF NOT EXISTS \`$shadow_database\`;

CREATE USER IF NOT EXISTS '$user'@'%' IDENTIFIED BY '$password';
CREATE USER IF NOT EXISTS '$user'@'localhost' IDENTIFIED BY '$password';

GRANT ALL PRIVILEGES ON \`$database\`.* TO '$user'@'%';
GRANT ALL PRIVILEGES ON \`$database\`.* TO '$user'@'localhost';
GRANT ALL PRIVILEGES ON \`$shadow_database\`.* TO '$user'@'%';
GRANT ALL PRIVILEGES ON \`$shadow_database\`.* TO '$user'@'localhost';

FLUSH PRIVILEGES;
SQL

echo "Prepared local databases: $database, $shadow_database"
