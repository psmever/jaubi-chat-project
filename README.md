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
This project uses `docker-compose` commands for the local Colima environment.

```sh
pnpm db:up
```

The default local connection string is:

```txt
mysql://jaubi_chat:jaubi_chat@localhost:23306/jaubi_chat
```

Useful local database commands:

```sh
pnpm db:up
pnpm db:down
pnpm db:restart
pnpm db:ps
pnpm db:logs
pnpm db:reset
```

`pnpm db:reset` recreates the local MariaDB volume, waits until MariaDB is healthy, then prepares both local databases:

- `jaubi_chat`
- `jaubi_chat_shadow`

## Package Names

- Root workspace: `jaubi-chat-project`
- Internal packages: `@jaubi-chat/*`
