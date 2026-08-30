import { ApiSuccessResponse } from '@jaubi-chat/api-contract';
import { Controller } from '@nestjs/common';

type RegisterResponse = {
    message: string;
};

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    register(): ApiSuccessResponse<RegisterResponse> {
        // email 유효성 검사
        // password 유효성 검사
        // email 죽복확인

        return {
            data: {
                message: 'User registered successfully',
            },
        };
    }
}
