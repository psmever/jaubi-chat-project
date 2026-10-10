import { ApiSuccessResponse } from '@jaubi-chat/api-contract';
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/auth/register.dto.ts';

type RegisterResponse = {
    message: string;
};

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    @Post('register')
    register(@Body() body: RegisterDto): ApiSuccessResponse<RegisterResponse> {
        // email 죽복확인

        console.debug(body);

        return {
            data: {
                message: 'User registered successfully',
            },
        };
    }
}
