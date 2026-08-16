# jaubi-chat Architecture

## Decisions

- Repository name: `jaubi-chat-project`
- Product name: `jaubi-chat`
- Monorepo: pnpm workspace with Turborepo
- Apps: NestJS backend, Next.js web, Expo mobile
- Realtime: Socket.IO
- Database: MariaDB
- Local Docker usage: MariaDB only
- ORM: Prisma
- Validation: Zod
- Web UI: Tailwind CSS and shadcn/ui
- Mobile UI: NativeWind

## Workspace Layout

```txt
apps/
  backend/
  web/
  mobile/
packages/
  shared/
  api-contract/
  config/
```
