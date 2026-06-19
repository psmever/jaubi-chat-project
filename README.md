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

## Make Commands

Run `make` or `make help` to see the available development commands.

```sh
make app:backend
make app:web
make app:mobile
make db:up
make prisma:generate
make prisma:migrate
make build
```

The Make targets call the existing pnpm workspace scripts, so `package.json` remains the command source of truth.

## API Collection

Open the `bruno` directory as a collection in Bruno and select the `local` environment.
The collection currently includes the implemented backend health check:

```txt
GET {{baseUrl}}/health
```

Add requests to this collection alongside new REST API endpoints. Keep credentials and tokens out of committed environment files.

## Package Names

- Root workspace: `jaubi-chat-project`
- Internal packages: `@jaubi-chat/*`
