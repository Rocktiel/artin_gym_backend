import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import {
  getValidationMessage,
  DtoField,
  ValidationMessage,
} from 'src/common/enums/ValidationMessages.enum';

export class RegisterRequestDto {
  @ApiProperty({
    example: 'example@company.com',
    description: 'Kullanıcının e-posta adresi',
  })
  @MinLength(11, {
    message: getValidationMessage(
      DtoField.USERNAME,
      ValidationMessage.MIN_LENGTH,
      { value: 11 },
    ),
  })
  @MaxLength(50, {
    message: getValidationMessage(
      DtoField.USERNAME,
      ValidationMessage.MAX_LENGTH,
      { value: 50 },
    ),
  })
  @IsNotEmpty({
    message: getValidationMessage(
      DtoField.USERNAME,
      ValidationMessage.IS_NOT_EMPTY,
    ),
  })
  username: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Kullanıcının şifresi (en az 6 karakter)',
  })
  @MinLength(6, {
    message: getValidationMessage(
      DtoField.PASSWORD,
      ValidationMessage.MIN_LENGTH,
      { value: 6 },
    ),
  })
  @MaxLength(50, {
    message: getValidationMessage(
      DtoField.PASSWORD,
      ValidationMessage.MAX_LENGTH,
      { value: 50 },
    ),
  })
  @IsNotEmpty({
    message: getValidationMessage(
      DtoField.PASSWORD,
      ValidationMessage.IS_NOT_EMPTY,
    ),
  })
  password: string;

  @ApiProperty({
    example: 'Artin Gym',
    description: 'Tenant (şirket/organizasyon) adı',
  })
  @MinLength(3, {
    message: getValidationMessage(
      DtoField.TENANT_NAME,
      ValidationMessage.MIN_LENGTH,
      { value: 3 },
    ),
  })
  @MaxLength(100, {
    message: getValidationMessage(
      DtoField.TENANT_NAME,
      ValidationMessage.MAX_LENGTH,
      { value: 100 },
    ),
  })
  @IsNotEmpty({
    message: getValidationMessage(
      DtoField.TENANT_NAME,
      ValidationMessage.IS_NOT_EMPTY,
    ),
  })
  tenantName: string;
}
