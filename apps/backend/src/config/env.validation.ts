import { z } from 'zod';

const environmentSchema = z
    .object({
        NODE_ENV: z.enum(['local', 'development', 'test', 'production']).default('local'),

        BACKEND_PORT: z.coerce.number().int().min(1).max(65535).default(4001),

        BACKEND_CORS_ORIGIN: z.string().url().default(`http://localhost:4002`),

        FRONTEND_URL: z.string().url().default(`http://localhost:4002`),

        DATABASE_URL: z
            .string()
            .min(1)
            .refine((value) => value.startsWith('mysql://'), {
                message: 'DATABASE_URL must start with mysql://',
            }),

        SHADOW_DATABASE_URL: z
            .string()
            .refine((value) => value.startsWith('mysql://'), {
                message: 'SHADOW_DATABASE_URL must start with mysql://',
            })
            .optional(),

        SMTP_HOST: z.string().trim().min(1).default('smtp.gmail.com'),
        SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(465),
        SMTP_USER: z.string().email(),
        SMTP_PASSWORD: z.string().min(1),
        SMTP_DEV_RECIPIENT: z.string().email().optional(),

        JWT_ACCESS_SECRET: z.string().min(32).optional(),
        JWT_REFRESH_SECRET: z.string().min(32).optional(),
    })
    .passthrough()
    .superRefine((environment, context) => {
        if (environment.NODE_ENV === 'local' && !environment.SMTP_DEV_RECIPIENT) {
            context.addIssue({
                code: 'custom',
                path: ['SMTP_DEV_RECIPIENT'],
                message: 'SMTP_DEV_RECIPIENT is required when NODE_ENV is local',
            });
        }
    });

/**
 * 애플리케이션 환경변수를 검증하고 변환된 설정값을 반환한다.
 */
export function validateEnvironment(config: Record<string, unknown>): Record<string, unknown> {
    const result = environmentSchema.safeParse(config);

    if (!result.success) {
        const messages = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');

        throw new Error(`Environment validation failed:\n${messages}`);
    }

    return result.data;
}
