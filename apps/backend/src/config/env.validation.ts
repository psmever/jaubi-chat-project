import { z } from 'zod';

const environmentSchema = z
    .object({
        NODE_ENV: z.enum(['local', 'development', 'test', 'production']).default('local'),

        BACKEND_PORT: z.coerce.number().int().min(1).max(65535).default(4001),

        BACKEND_CORS_ORIGIN: z.string().url().default(`http://localhost:4002`),

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

        JWT_ACCESS_SECRET: z.string().min(32).optional(),
        JWT_REFRESH_SECRET: z.string().min(32).optional(),
    })
    .passthrough();

export function validateEnvironment(config: Record<string, unknown>): Record<string, unknown> {
    const result = environmentSchema.safeParse(config);

    if (!result.success) {
        const messages = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');

        throw new Error(`Environment validation failed:\n${messages}`);
    }

    return result.data;
}
