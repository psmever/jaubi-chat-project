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

Generate backend JWT secrets with:

```sh
pnpm jwt:generate
```

Use `pnpm jwt:generate -- --force` only when you intentionally want to rotate the secrets in `apps/backend/.env`.

## Make Commands

사용 가능한 개발 명령은 `make` 또는 `make help`로 확인할 수 있습니다.

```sh
make app:backend
make app:web
make app:mobile
make db:up
make prisma:generate
make prisma:migrate
make build
```

Make target은 기존 pnpm workspace script를 호출합니다. 따라서 실제 명령 정의의 기준은 `package.json`입니다.

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
