import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway.ts';

@Module({
    providers: [RealtimeGateway],
})
export class RealtimeModule {}
