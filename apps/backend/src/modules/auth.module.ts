import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service.ts';
import { AuthController } from '../controllers/auth.controller.ts';
import { UsersModule } from './users.module.ts';
import { AuthRepository } from '../repositories/auth.repository.ts';

@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
    exports: [AuthService],
})
export class AuthModule {}
