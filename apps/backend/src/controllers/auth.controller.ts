import { ApiSuccessResponse } from '@jaubi-chat/api-contract';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/auth/register.dto.ts';
import { AuthService } from '../services/auth.service.ts';
import { ApiException } from '../common/http/api-exception.ts';
type RegisterResponse = {
    message: string;
};

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('register')
    async register(@Body() body: RegisterDto): Promise<ApiSuccessResponse<RegisterResponse>> {
        console.log(`--------------start----------------------`);
        console.log(body);
        console.log(`--------------end----------------------`);

        const emailExists = await this.authService.existsUserEmail(body.email);

        if (emailExists) {
            throw new ApiException('AUTH_EMAIL_ALREADY_EXISTS', '이미 사용 중인 이메일입니다.', HttpStatus.CONFLICT);
        }


        const userPassword = 

        return {
            data: {
                message: 'User registered successfully',
            },
        };
    }
}
