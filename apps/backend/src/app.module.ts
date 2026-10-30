import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { appConfig } from './config/app.config.ts';
import { validateEnvironment } from './config/env.validation.ts';
import { HealthModule } from './modules/health.module.ts';
import { PrismaModule } from './modules/prisma.module.ts';
import { AppController } from './controllers/app.controller.ts';
import { UsersModule } from './modules/users.module.ts';
import { AuthModule } from './modules/auth.module.ts';
import { RequestLoggingMiddleware } from './common/http/request-logging.middleware.ts';
import { ApiSuccessResponseInterceptor } from './common/http/api-success-response.interceptor.ts';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            validate: validateEnvironment,
        }),
        PrismaModule,
        HealthModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ApiSuccessResponseInterceptor,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RequestLoggingMiddleware).forRoutes('*');
    }
}
