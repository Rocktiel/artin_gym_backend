import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class VerifyQrRequestDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiI...',
    description: 'QR kodun içeriği olan imzalı JWT token.',
    required: true,
  })
  @IsNotEmpty({ message: 'Token zorunludur.' })
  @IsString({ message: 'Token string formatında olmalıdır.' })
  token: string;
}
