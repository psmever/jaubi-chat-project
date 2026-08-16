# API Notes

REST should handle authentication, user lookup, room lists, room creation, previous message loading, and file upload.

Socket.IO should handle room membership, message delivery, read status, and typing state.

## Auth Module Plan

Auth should be implemented before room and message APIs so REST and Socket.IO can share the same user identity.

Initial endpoints:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/me`

Initial backend structure:

```txt
apps/backend/src/modules/auth/
  auth.controller.ts
  auth.module.ts
  auth.service.ts
  dto/
    login.dto.ts
    register.dto.ts
    refresh-token.dto.ts
  guards/
    jwt-auth.guard.ts
  strategies/
    jwt.strategy.ts

apps/backend/src/modules/users/
  users.controller.ts
  users.module.ts
  users.service.ts
```

Response shape should use `ApiSuccessResponse<T>` for success and `ApiException` for expected failures.

Recommended dependencies before implementation:

- `@nestjs/jwt`
- `@nestjs/passport`
- `passport`
- `passport-jwt`
- `bcrypt`
- `@types/passport-jwt`
- `@types/bcrypt`

JWT configuration should use the existing `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` environment variables.
