import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { BaseResponse } from 'src/base/response/base.response';
import { ResponseMessages } from 'src/common/enums/ResponseMessages.enum';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseErrorResponse } from 'src/base/response/baseError.response';
import { RegisterMemberRequestDto } from './dto/request/register-member.request.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypes } from 'src/common/enums/UserTypes.enums';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Kullanıcı giriş işlemi

  @Throttle({ default: { limit: 4, ttl: 30000 } }) // 30 saniyede 4 kez giriş deneme sınırı
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
    } catch (error) {
      if (error.getStatus) {
        throw error;
      }
      // Diğer beklenmedik hatalar için genel UnauthorizedException
      throw new UnauthorizedException(ResponseMessages.LOGIN_FAILED);
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yeni tenant oluşturur' })
  @ApiResponse({
    status: 201,
    description: 'Kayıt başarılı',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz istek veya USERNAME kullanılmış',
    type: BaseErrorResponse,
  })
  async register(@Body() dto: RegisterRequestDto): Promise<BaseResponse<any>> {
    try {
      const result = await this.authService.register(dto);

      return new BaseResponse(result, true, ResponseMessages.REGISTER_SUCCESS);
    } catch (error) {
      if (error.getStatus) {
        throw error;
      }
      // Diğer beklenmedik hatalar için genel UnauthorizedException
      throw new UnauthorizedException(ResponseMessages.REGISTER_FAILED);
    }
  }

  @Post('register-member')
  @UseGuards(JwtAuthGuard, RolesGuard) // Önce kimlik doğrula, sonra rolü kontrol et
  @Roles(UserTypes.COMPANY_ADMIN) // Sadece COMPANY_ADMIN çağırabilir
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Mevcut bir işletmeye yeni üye kaydeder' })
  async registerMember(
    @Body() dto: RegisterMemberRequestDto,
    @GetUser('tenant_id') tenantId: string, // Token'dan tenant ID'yi al
  ): Promise<BaseResponse<any>> {
    try {
      // KONTROL: Eğer tenantId yoksa (SUPER_ADMIN gibi), yetki hatası fırlat
      if (!tenantId) {
        throw new ForbiddenException(
          ResponseMessages.FORBIDDEN_NO_TENANT_ACCESS,
        );
      }
      const result = await this.authService.registerMember(dto, tenantId);
      return new BaseResponse(result, true, 'Üye başarıyla kaydedildi.');
    } catch (error) {
      if (error.getStatus) {
        throw error;
      }
      throw new BadRequestException('Üye kaydı başarısız oldu.');
    }
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard) // Önce kimlik doğrula, sonra rolü kontrol et
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mevcut bir işletmeye yeni üye kaydeder' })
  async changePassword(
    @Body('userId') userId: number, // Token'dan kullanıcı ID'sini al
    @Body('newPassword') newPassword: string,
  ): Promise<BaseResponse<any>> {
    try {
      const result = await this.authService.changePassword(userId, newPassword);
      return new BaseResponse(result, true, 'Parola basarıyla degistirildi.');
    } catch (error) {
      if (error.getStatus) {
        throw error;
      }
      throw new BadRequestException('Parola degistirme basarısız oldu.');
    }
  }
}
