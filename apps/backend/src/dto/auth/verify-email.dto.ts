import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
    @IsString({ message: '인증 토큰은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '인증 토큰을 입력해 주세요.' })
    token!: string;
}
