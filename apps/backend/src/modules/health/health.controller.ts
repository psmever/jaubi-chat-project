import { Controller, Get } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { ApiSuccessResponse } from '@jaubi-chat/api-contract';

type HealthResponse = {
    status: 'healthy';
    timestamp: string;
    uuid: string;
};

@Controller('health')
export class HealthController {
    @Get()
    getHealth(): ApiSuccessResponse<HealthResponse> {
        return {
            data: {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uuid: randomUUID(),
            },
        };
    }
}
