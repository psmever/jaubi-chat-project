import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service.ts';

@Injectable()
export class AuthRepository {
    constructor(private readonly prismaService: PrismaService) {}

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
}
