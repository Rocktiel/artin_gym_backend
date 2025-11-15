import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import {
  getValidationMessage,
  DtoField,
  ValidationMessage,
} from 'src/common/enums/ValidationMessages.enum';

export class LoginRequestDto {
  @ApiProperty()
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

  @ApiProperty()
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
}
