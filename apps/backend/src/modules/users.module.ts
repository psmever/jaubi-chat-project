import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller.ts';
import { UsersService } from '../services/users.service.ts';
import { UsersRepository } from '../repositories/users.repository.ts';

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
