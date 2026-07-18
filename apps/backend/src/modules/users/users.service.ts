import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    findById(id: string) {}

    findByEmail(email: string) {}

    createUser(inputData: { email: string; displayName: string; passwordHash: string }) {}
}
