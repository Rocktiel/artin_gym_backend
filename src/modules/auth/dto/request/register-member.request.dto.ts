// src/modules/auth/dto/request/register-member.request.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  DtoField,
  getValidationMessage,
  ValidationMessage,
} from 'src/common/enums/ValidationMessages.enum';

export class PhysicalDataDto {
  @ApiPropertyOptional({
    example: 175,
    description: 'Boy (santimetre cinsinden)',
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Boy bilgisi sayı olmalıdır.' })
  @Min(50, { message: 'Boy, 50 cm den küçük olamaz.' })
  heightCm?: number;

  @ApiPropertyOptional({
    example: 85.5,
    description: 'Kilo (kilogram cinsinden)',
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Kilo bilgisi sayı olmalıdır.' })
  @Min(10, { message: 'Kilo, 10 kg den küçük olamaz.' })
  weightKg?: number;

  // @ApiPropertyOptional({
  //   example: 18.2,
  //   description: 'Vücut Yağ Oranı (%)',
  //   type: Number,
  // })
  // @IsOptional()
  // @IsNumber({}, { message: 'Vücut Yağ Oranı sayı olmalıdır.' })
  // @Min(1, { message: 'Yağ oranı 1 den küçük olamaz.' })
  // bodyFatPercentage?: number;

  // @ApiPropertyOptional({
  //   example: 75,
  //   description: 'Üyenin Hedef Kilosu (kg)',
  //   type: Number,
  // })
  // @IsOptional()
  // @IsNumber({}, { message: 'Hedef kilo sayı olmalıdır.' })
  // targetWeightKg?: number;
}

export class RegisterMemberRequestDto {
  // --- 1. EMAIL ---
  // @ApiProperty({
  //   example: 'newmember@mail.com',
  //   description: 'Üyenin e-posta adresi (Login için kullanılır)',
  // })
  // @IsString({
  //   message: getValidationMessage(DtoField.EMAIL, ValidationMessage.IS_STRING),
  // })
  // @IsEmail(
  //   {},
  //   {
  //     message: getValidationMessage(DtoField.EMAIL, ValidationMessage.IS_EMAIL),
  //   },
  // )
  // @MinLength(11, {
  //   message: getValidationMessage(
  //     DtoField.EMAIL,
  //     ValidationMessage.MIN_LENGTH,
  //     { value: 11 },
  //   ),
  // })
  // @MaxLength(50, {
  //   message: getValidationMessage(
  //     DtoField.EMAIL,
  //     ValidationMessage.MAX_LENGTH,
  //     { value: 50 },
  //   ),
  // })
  // @IsNotEmpty({
  //   message: getValidationMessage(
  //     DtoField.EMAIL,
  //     ValidationMessage.IS_NOT_EMPTY,
  //   ),
  // })
  // email: string;

  // --- 2. PASSWORD ---
  // @ApiProperty({
  //   example: 'M.emBer123!',
  //   description: 'Üyenin şifresi',
  //   minLength: 6,
  //   maxLength: 50,
  // })
  // @IsString({
  //   message: getValidationMessage(
  //     DtoField.PASSWORD,
  //     ValidationMessage.IS_STRING,
  //   ),
  // })
  // @MinLength(6, {
  //   message: getValidationMessage(
  //     DtoField.PASSWORD,
  //     ValidationMessage.MIN_LENGTH,
  //     { value: 6 },
  //   ),
  // })
  // @MaxLength(50, {
  //   message: getValidationMessage(
  //     DtoField.PASSWORD,
  //     ValidationMessage.MAX_LENGTH,
  //     { value: 50 },
  //   ),
  // })
  // @IsNotEmpty({
  //   message: getValidationMessage(
  //     DtoField.PASSWORD,
  //     ValidationMessage.IS_NOT_EMPTY,
  //   ),
  // })
  // password: string;

  // --- 3. FIRST NAME ---
  @ApiProperty({ example: 'Ayşe', description: 'Üyenin Adı' })
  @IsString({ message: 'Ad alanı string olmalıdır.' })
  @MinLength(2, { message: 'Ad en az 2 karakter olmalıdır.' })
  @MaxLength(100, { message: 'Ad en fazla 100 karakter olmalıdır.' })
  @IsNotEmpty({ message: 'Ad alanı zorunludur.' })
  firstName: string;

  // --- 4. LAST NAME ---
  @ApiProperty({ example: 'Yılmaz', description: 'Üyenin Soyadı' })
  @IsString({ message: 'Soyad alanı string olmalıdır.' })
  @MinLength(2, { message: 'Soyad en az 2 karakter olmalıdır.' })
  @MaxLength(100, { message: 'Soyad en fazla 100 karakter olmalıdır.' })
  @IsNotEmpty({ message: 'Soyad alanı zorunludur.' })
  lastName: string;

  // --- 5. PHONE NUMBER ---
  @ApiProperty({
    example: '5321234567',
    description: 'Üyenin telefon numarası (Başında ülke kodu olmadan 10 hane)',
  })
  @IsString({ message: 'Telefon numarası string olmalıdır.' })
  @MinLength(10, { message: 'Telefon numarası en az 10 karakter olmalıdır.' })
  @MaxLength(20, {
    message: 'Telefon numarası en fazla 20 karakter olmalıdır.',
  })
  @IsNotEmpty({ message: 'Telefon numarası zorunludur.' })
  phoneNumber: string;

  // --- 6. EMERGENCY CONTACT (Optional) ---
  @ApiPropertyOptional({
    example: '5329876543',
    description: 'Acil durum iletişim numarası',
  })
  @IsOptional()
  @IsString({ message: 'Acil durum iletişim numarası string olmalıdır.' })
  @MaxLength(20, {
    message: 'Acil durum iletişim numarası en fazla 20 karakter olmalıdır.',
  })
  emergencyContact?: string;

  // --- 7. DATE OF BIRTH (Yeni Alan) ---
  @ApiPropertyOptional({
    example: '1990-05-25',
    description: 'Üyenin doğum tarihi (YYYY-MM-DD formatında)',
    type: String, // Swagger için String olarak gösterilmeli
    format: 'date',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'Doğum tarihi geçerli bir tarih formatında (YYYY-MM-DD) olmalıdır.',
    },
  )
  dateOfBirth?: string; // String olarak alınıp serviste Date'e çevrilecek

  // --- 7. PHYSICAL DATA (JSON Object) ---
  @ApiPropertyOptional({
    type: PhysicalDataDto,
    description: 'Üyenin başlangıçtaki boy, kilo gibi fiziksel verileri.',
  })
  @IsOptional()
  @ValidateNested() // İç içe doğrulama için gerekli
  @Type(() => PhysicalDataDto) // class-transformer ile tipi belirtiyoruz
  physicalData?: PhysicalDataDto;
}
