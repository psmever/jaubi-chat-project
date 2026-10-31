import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service.ts';

export type VerifyEmailTokenResult =
    | {
          success: true;
      }
    | {
          success: false;
          reason: 'TOKEN_NOT_FOUND' | 'TOKEN_EXPIRED' | 'TOKEN_UNAVAILABLE';
      };

@Injectable()
export class AuthRepository {
    constructor(private readonly prismaService: PrismaService) {}

    /**
     * 사용자와 이메일 인증 토큰을 하나의 트랜잭션으로 생성한다.
     */
    createUserWithVerificationToken(input: {
        email: string;
        displayName: string;
        passwordHash: string;
        tokenHash: string;
        tokenExpiresAt: Date;
    }) {
        return this.prismaService.$transaction(async (transaction) => {
            const user = await transaction.user.create({
                data: {
                    email: input.email,
                    displayName: input.displayName,
                    passwordHash: input.passwordHash,
                },
                select: {
                    id: true,
                    email: true,
                    displayName: true,
                    emailVerifiedAt: true,
                    createdAt: true,
                },
            });

            await transaction.emailVerificationToken.create({
                data: {
                    userId: user.id,
                    tokenHash: input.tokenHash,
                    expiresAt: input.tokenExpiresAt,
                },
                select: {
                    id: true,
                    userId: true,
                    tokenHash: true,
                    expiresAt: true,
                    createdAt: true,
                },
            });

            return user;
        });
    }

    /**
     * 해시된 인증 토큰의 유효성을 검사하고,
     * 토큰 사용 처리와 사용자 이메일 인증을 하나의 트랜잭션으로 완료한다.
     */
    verifyEmailToken = async (tokenHash: string): Promise<VerifyEmailTokenResult> => {
        return await this.prismaService.$transaction(async (transaction): Promise<VerifyEmailTokenResult> => {
            const verificationToken = await transaction.emailVerificationToken.findUnique({
                where: {
                    tokenHash,
                },
                include: {
                    user: {
                        select: {
                            emailVerifiedAt: true,
                        },
                    },
                },
            });

            if (!verificationToken) {
                return {
                    success: false,
                    reason: 'TOKEN_NOT_FOUND',
                };
            }

            // 이미 인증된 사용자는 성공으로 처리
            if (verificationToken.user.emailVerifiedAt) {
                return {
                    success: true,
                };
            }

            if (verificationToken.usedAt) {
                return {
                    success: false,
                    reason: 'TOKEN_UNAVAILABLE',
                };
            }

            const verifiedAt = new Date();

            if (verificationToken.expiresAt <= verifiedAt) {
                return {
                    success: false,
                    reason: 'TOKEN_EXPIRED',
                };
            }

            const tokenUpdateResult = await transaction.emailVerificationToken.updateMany({
                where: {
                    id: verificationToken.id,
                    usedAt: null,
                    expiresAt: {
                        gt: verifiedAt,
                    },
                },
                data: {
                    usedAt: verifiedAt,
                },
            });

            if (tokenUpdateResult.count !== 1) {
                return {
                    success: false,
                    reason: 'TOKEN_UNAVAILABLE',
                };
            }

            await transaction.user.update({
                where: {
                    id: verificationToken.userId,
                },
                data: {
                    emailVerifiedAt: verifiedAt,
                },
            });

            return {
                success: true,
            };
        });
    };
}
