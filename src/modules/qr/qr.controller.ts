import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { QrService } from './qr.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypes } from 'src/common/enums/UserTypes.enums';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { BaseResponse } from 'src/base/response/base.response';
import { ResponseMessages } from 'src/common/enums/ResponseMessages.enum';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { VerifyQrRequestDto } from './dto/request/verify-qr.request.dto';

@Controller('qr')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class QrController {
  constructor(private readonly qrService: QrService) {}

  // QR token üretir
  @Post('generate/:memberId')
  async generateQr(@Param('memberId') memberId: string) {
    try {
      const token = await this.qrService.generateQrToken(+memberId);
      return new BaseResponse(
        token,
        true,
        ResponseMessages.SUCCESS_QR_TOKEN_GENERATED,
      );
    } catch (error) {
      return new BaseResponse(
        null,
        false,
        error.message || ResponseMessages.GENERATE_QR_TOKEN_ERROR,
      );
    }
  }

  // QR doğrulaması yapar
  @Post('verify')
  async verifyQr(@Body() dto: VerifyQrRequestDto) {
    if (!dto.token) {
      throw new UnauthorizedException('QR token missing.');
    }

    try {
      const result = await this.qrService.verifyQrToken(dto.token);
      return new BaseResponse(result, true, ResponseMessages.SUCCESS_VERIFY_QR);
    } catch (error) {
      return new BaseResponse(
        null,
        false,
        error.message || ResponseMessages.VERIFY_QR_TOKEN_ERROR,
      );
    }
  }
}
