import { ApiSuccessResponse } from '@jaubi-chat/api-contract';
import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/auth/register.dto.ts';
import { AuthService } from '../services/auth.service.ts';
import { ApiException } from '../common/http/api-exception.ts';
import { createHash, randomBytes } from 'node:crypto';
import type { ConfigType } from '@nestjs/config';
import { appConfig } from '../config/app.config.ts';
import { AuthRepository } from '../repositories/auth.repository.ts';
import { isPrismaUniqueConstraintError } from '../common/prisma/prisma-error.ts';

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authRepository: AuthRepository,

        @Inject(appConfig.KEY)
        private readonly config: ConfigType<typeof appConfig>,
    ) {}
    @Post('register')
    async register(@Body() body: RegisterDto): Promise<ApiSuccessResponse<{ id: string; email: string; displayName: string }>> {
        const emailExists = await this.authService.existsUserEmail(body.email);

        if (emailExists) {
            throw new ApiException('AUTH_EMAIL_ALREADY_EXISTS', '이미 사용 중인 이메일입니다.', HttpStatus.CONFLICT);
        }

        const hashPassword = await this.authService.hashPassword(body.password);

        const verificationToken = randomBytes(32).toString('hex');

        const tokenHash = createHash('sha256').update(verificationToken).digest('hex');

        const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const verificationUrl = new URL('/auth/email/verify', this.config.frontendUrl);
        verificationUrl.searchParams.set('token', verificationToken);

        try {
            const createdUser = await this.authRepository.createUserWithVerificationToken({
                email: body.email,
                displayName: body.displayName,
                passwordHash: hashPassword,
                tokenHash: tokenHash,
                tokenExpiresAt: tokenExpiresAt,
            });

            return {
                message: 'User registered successfully',
                data: {
                    id: createdUser.id,
                    email: createdUser.email,
                    displayName: createdUser.displayName,
                },
            };
        } catch (error: unknown) {
            if (isPrismaUniqueConstraintError(error, ['users_email_key', 'email'])) {
                throw this.createEmailAlreadyExistsException();
            }

            throw error;
        }
    }

    private createEmailAlreadyExistsException(): ApiException {
        return new ApiException('AUTH_EMAIL_ALREADY_EXISTS', '이미 사용 중인 이메일입니다.', HttpStatus.CONFLICT);
    }
}
