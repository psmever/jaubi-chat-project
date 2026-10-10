import { ApiSuccessResponse } from '@jaubi-chat/api-contract';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/auth/register.dto.ts';
import { AuthService } from '../services/auth.service.ts';
import { ApiException } from '../common/http/api-exception.ts';
import { UsersService } from '../services/users.service.ts';

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}
    @Post('register')
    async register(@Body() body: RegisterDto): Promise<ApiSuccessResponse<{ id: string; email: string; displayName: string }>> {
        const emailExists = await this.authService.existsUserEmail(body.email);

        if (emailExists) {
            throw new ApiException('AUTH_EMAIL_ALREADY_EXISTS', '이미 사용 중인 이메일입니다.', HttpStatus.CONFLICT);
        }

        const hashPassword = await this.authService.hashPassword(body.password);

        const createdUser = await this.usersService.createUser({
            email: body.email,
            displayName: body.displayName,
            passwordHash: hashPassword,
        });

        return {
            message: 'User registered successfully',
            data: {
                id: createdUser.id,
                email: createdUser.email,
                displayName: createdUser.displayName,
            },
        };
    }
}
