import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.ts';
import { HealthModule } from './modules/health/health.module.ts';
import { MessagesModule } from './modules/messages/messages.module.ts';
import { PrismaModule } from './modules/prisma/prisma.module.ts';
import { RealtimeModule } from './modules/realtime/realtime.module.ts';
import { RoomsModule } from './modules/rooms/rooms.module.ts';
import { UsersModule } from './modules/users/users.module.ts';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RoomsModule,
    MessagesModule,
    RealtimeModule
  ]
})
export class AppModule {}
