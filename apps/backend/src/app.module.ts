import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config.ts';
import { validateEnvironment } from './config/env.validation.ts';
import { HealthModule } from './modules/health/health.module.ts';
import { PrismaModule } from './modules/prisma/prisma.module.ts';
import { RealtimeModule } from './modules/realtime/realtime.module.ts';

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
    ],
})
export class AppModule {}
