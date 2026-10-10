import { Module } from '@nestjs/common';
import { HealthController } from '../controllers/health.controller.ts';

@Module({
    controllers: [HealthController],
})
export class HealthModule {}
