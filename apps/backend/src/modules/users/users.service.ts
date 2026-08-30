import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';

type CreateUserInput = {
    email: string;
    displayName: string;
    passwordHash: string;
};

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    createUser(inputData: CreateUserInput) {
        return this.prisma.user.create({
            data: inputData,
        });
    }
}
