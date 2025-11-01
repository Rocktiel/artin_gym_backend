import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  tenantName: string;
}
