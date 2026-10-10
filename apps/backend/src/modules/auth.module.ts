import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service.ts';
import { AuthController } from '../controllers/auth.controller.ts';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
