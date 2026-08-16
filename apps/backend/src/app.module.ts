import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config.ts';
import { validateEnvironment } from './config/env.validation.ts';
import { HealthModule } from './modules/health/health.module.ts';
import { PrismaModule } from './modules/prisma/prisma.module.ts';
import { RealtimeModule } from './modules/realtime/realtime.module.ts';
import { AppController } from './app.controller.ts';
import { UsersModule } from './modules/users/users.module.ts';
import { AuthModule } from './modules/auth/auth.module.ts';
import { RequestLoggingMiddleware } from './common/http/request-logging.middleware.ts';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            validate: validateEnvironment,
        }),
        PrismaModule,
        HealthModule,
        RealtimeModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RequestLoggingMiddleware).forRoutes('*');
    }
}
