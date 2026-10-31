import { ApiSuccessResponse } from '@jaubi-chat/api-contract';
import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/auth/register.dto.ts';
import { VerifyEmailDto } from '../dto/auth/verify-email.dto.ts';
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

    /**
     * 신규 사용자와 이메일 인증 토큰을 저장한 뒤 인증 메일을 발송한다.
     * 로컬 환경에서는 API 응답에 원본 인증 토큰을 포함한다.
     */
    @Post('register')
    async register(
        @Body() body: RegisterDto,
    ): Promise<ApiSuccessResponse<{ id: string; email: string; displayName: string; verificationToken?: string }>> {
        const isLocal = this.config.nodeEnv === 'local';
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

            /**
             * TODO: 프런트엔드 이메일 인증 화면 구현 시 인증 메일 재발송 API를 추가한다.
             * 미인증 사용자의 재요청과 SMTP 발송 실패를 처리하고,
             * 새 인증 메일 발송 성공 후 기존 미사용 토큰을 폐기한다.
             */
            await this.mailService.sendVerificationEmail(body.email, verificationUrl.toString());

            if (isLocal) {
                return {
                    message: '회원가입이 완료되었습니다.',
                    data: {
                        id: createdUser.id,
                        email: createdUser.email,
                        displayName: createdUser.displayName,
                        verificationToken: verificationToken.toString(),
                    },
                };
            }

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

    /**
     * 요청받은 원본 인증 토큰을 검증하여 사용자의 이메일 인증을 완료한다.
     */
    @Post('email/verify')
    async verifyEmail(@Body() body: VerifyEmailDto): Promise<ApiSuccessResponse<null>> {
        const result = await this.authService.verifyEmail(body.token);

        if (!result.success) {
            switch (result.reason) {
                case 'TOKEN_NOT_FOUND':
                    throw new ApiException(
                        'AUTH_EMAIL_VERIFICATION_TOKEN_INVALID',
                        '유효하지 않은 인증 링크입니다.',
                        HttpStatus.BAD_REQUEST,
                    );

                case 'TOKEN_EXPIRED':
                    throw new ApiException('AUTH_EMAIL_VERIFICATION_TOKEN_EXPIRED', '인증 링크가 만료되었습니다.', HttpStatus.BAD_REQUEST);

                case 'TOKEN_UNAVAILABLE':
                    throw new ApiException(
                        'AUTH_EMAIL_VERIFICATION_TOKEN_UNAVAILABLE',
                        '사용할 수 없는 인증 링크입니다.',
                        HttpStatus.BAD_REQUEST,
                    );
            }
        }

        return {
            message: '이메일 인증이 완료되었습니다.',
            data: null,
        };
    }
}
