import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ResponseMessages } from 'src/common/enums/ResponseMessages.enum';
import { BaseResponse } from 'src/base/response/base.response';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  // Direkt SMS gönder (Şu anlık sms göndermiyor)
  @Post('send-sms')
  async sendSms(
    @Body() body: { to: string; message: string },
  ): Promise<BaseResponse<any>> {
    const result = await this.smsService.sendSms(body.to, body.message);
    return new BaseResponse(result, true, ResponseMessages.SUCCESS_SMS_SENT);
  }

  // OTP oluştur ve SMS ile gönder(Şu anlık sms göndermiyor)
  @Post('send-code')
  async sendCode(@Body() body: { phone: string }): Promise<BaseResponse<any>> {
    const result = await this.smsService.sendCode(body.phone);
    return new BaseResponse(result, true, ResponseMessages.SUCCESS_OTP_SENT);
  }

  // OTP doğrulama
  @Post('verify-code')
  async verifyCode(
    @Body() body: { phone: string; code: string },
  ): Promise<BaseResponse<any>> {
    const result = await this.smsService.verifyCode(body.phone, body.code);

    if (!result.success) {
      // Kod yanlış veya süresi dolmuş
      return new BaseResponse(
        null,
        false,
        result.message || ResponseMessages.ERROR,
      );
    }

    return new BaseResponse(
      result,
      true,
      ResponseMessages.SUCCESS_OTP_VERIFIED,
    );
  }
}
