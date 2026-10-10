import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository.ts';

type CreateUserInput = {
    email: string;
    displayName: string;
    passwordHash: string;
};

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    findById(id: string) {
        return this.usersRepository.findById(id);
    }

    findByEmail(email: string) {
        return this.usersRepository.findByEmail(email);
    }

    createUser(inputData: CreateUserInput) {
        return this.usersRepository.createUser(inputData);
    }
}
