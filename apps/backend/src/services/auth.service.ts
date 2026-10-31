import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { AuthRepository, VerifyEmailTokenResult } from '../repositories/auth.repository.ts';
import { UsersService } from './users.service.ts';

@Injectable()
export class AuthService {
    private readonly saltRounds = 12;
    constructor(
        private readonly usersService: UsersService,
        private readonly authRepository: AuthRepository,
    ) {}

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

    /**
     * 원본 인증 토큰을 SHA-256으로 해시한 뒤 저장소에 인증 처리를 요청한다.
     */
    async verifyEmail(token: string): Promise<VerifyEmailTokenResult> {
        const tokenHash = createHash('sha256').update(token).digest('hex');

        return await this.authRepository.verifyEmailToken(tokenHash);
    }
}
