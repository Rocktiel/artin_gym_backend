import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { BaseResponse } from 'src/base/response/base.response';
import { ResponseMessages } from 'src/common/enums/ResponseMessages.enum';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseErrorResponse } from 'src/base/response/baseError.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Kullanıcı giriş işlemi

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kullanıcı girişi yapar' })
  @ApiResponse({
    status: 200,
    description: 'Giriş başarılı',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Geçersiz kimlik bilgileri',
    type: BaseErrorResponse,
  })
  async login(@Body() loginDto: LoginRequestDto): Promise<BaseResponse<any>> {
    try {
      const result = await this.authService.login(loginDto);
      return new BaseResponse(result, true, ResponseMessages.LOGIN_SUCCESS);
    } catch {
      throw new UnauthorizedException(ResponseMessages.LOGIN_FAILED);
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yeni tenant ve admin kaydı oluşturur' })
  @ApiResponse({
    status: 201,
    description: 'Kayıt başarılı',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz istek veya email kullanılmış',
    type: BaseErrorResponse,
  })
  async register(@Body() dto: RegisterRequestDto): Promise<BaseResponse<any>> {
    try {
      const result = await this.authService.register(
        dto.email,
        dto.password,
        dto.tenantName,
      );

      return new BaseResponse(result, true, ResponseMessages.REGISTER_SUCCESS);
    } catch (error) {
      throw new BadRequestException(ResponseMessages.REGISTER_FAILED);
    }
  }
}
