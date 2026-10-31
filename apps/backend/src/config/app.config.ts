import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    appName: process.env.APP_NAME || 'JaubiChatBackend',
    appUrl: process.env.APP_URL || 'http://localhost:4001',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4002',
    nodeEnv: process.env.NODE_ENV || 'local',
    port: Number(process.env.BACKEND_PORT ?? 4001) || 4001,
    globalPrefix: process.env.GLOBAL_PREFIX || 'api',
    corsOrigin: process.env.BACKEND_CORS_ORIGIN || 'http://localhost:4002',
    gmail: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT ?? 465) || 465,
        user: process.env.SMTP_USER!,
        password: process.env.SMTP_PASSWORD!,
        devRecipient: process.env.SMTP_DEV_RECIPIENT,
    },
}));
