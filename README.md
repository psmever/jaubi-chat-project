# jaubi-chat-project

`jaubi-chat-project` is the monorepo for the `jaubi-chat` app.

## Structure

```txt
apps/
  backend/    # NestJS
  web/        # Next.js
  mobile/     # Expo
packages/
  shared/
  api-contract/
  config/
```

## Local Database

Docker is used only for the local MariaDB database.

```sh
docker compose up -d mariadb
```

The default local connection string is:

```txt
mysql://jaubi_chat:jaubi_chat@localhost:3306/jaubi_chat
```

## Package Names

- Root workspace: `jaubi-chat-project`
- Internal packages: `@jaubi-chat/*`
