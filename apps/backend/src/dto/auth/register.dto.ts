import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail({}, { message: '올바른 이메일 주소를 입력해 주세요.' })
    email!: string;

    @IsString({ message: '이름은 문자열이어야 합니다.' })
    @MinLength(2, { message: '이름은 2자 이상 입력해 주세요.' })
    @MaxLength(50, { message: '이름은 50자 이하로 입력해 주세요.' })
    displayName!: string;

    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @MinLength(8, { message: '비밀번호는 8자 이상 입력해 주세요.' })
    @MaxLength(100, { message: '비밀번호는 100자 이하로 입력해 주세요.' })
    password!: string;
}
