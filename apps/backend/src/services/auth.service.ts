import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service.ts';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly saltRounds = 12;
    constructor(private readonly usersService: UsersService) {}

    async existsUserEmail(email: string): Promise<boolean> {
        const user = await this.usersService.findByEmail(email);
        return !!user;
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
