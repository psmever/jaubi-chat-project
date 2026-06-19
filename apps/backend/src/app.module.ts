import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { MessagesModule } from './modules/messages/messages.module.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { RealtimeModule } from './modules/realtime/realtime.module.js';
import { RoomsModule } from './modules/rooms/rooms.module.js';
import { UsersModule } from './modules/users/users.module.js';

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
