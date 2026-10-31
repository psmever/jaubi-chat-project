import { ApiSuccessResponse } from '@jaubi-chat/api-contract';
import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/auth/register.dto.ts';
import { AuthService } from '../services/auth.service.ts';
import { MailService } from '../services/mail.service.ts';
import { ApiException } from '../common/http/api-exception.ts';
import { createHash, randomBytes } from 'node:crypto';
import type { ConfigType } from '@nestjs/config';
import { appConfig } from '../config/app.config.ts';
import { AuthRepository } from '../repositories/auth.repository.ts';
import { isPrismaUniqueConstraintError } from '../common/prisma/prisma-error.ts';
import { Logger } from '@nestjs/common';

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly authRepository: AuthRepository,
        private readonly mailService: MailService,

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

        await this.mailService.sendVerificationEmail(body.email, verificationUrl.toString());

        try {
            const createdUser = await this.authRepository.createUserWithVerificationToken({
                email: body.email,
                displayName: body.displayName,
                passwordHash: hashPassword,
                tokenHash: tokenHash,
                tokenExpiresAt: tokenExpiresAt,
            });

            return {
                message: '회원가입이 완료되었습니다.',
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

    @Post('email/verify')
    async verifyEmail(@Body('token') token: string): Promise<ApiSuccessResponse<{ token: string }>> {
        //
        const tokenHash = createHash('sha256').update(token).digest('hex');

        return {
            message: '이메일 인증이 완료되었습니다.',
            data: {
                token: tokenHash,
            },
        };
    }
}
