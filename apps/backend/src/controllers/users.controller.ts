import { ApiSuccessResponse } from '@jaubi-chat/api-contract';
import { Controller, Get } from '@nestjs/common';

type MeResponse = {
    id: string;
    username: string;
    email: string;
};
@Controller({
    path: 'users',
    version: '1',
})
export class UsersController {
    @Get('me')
    getMe(): ApiSuccessResponse<MeResponse> {
        return {
            data: {
                id: '1',
                username: 'john_doe',
                email: 'john_doe@example.com',
            },
        };
    }
}
