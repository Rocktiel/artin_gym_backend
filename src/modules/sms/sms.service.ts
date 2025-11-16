import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, VerificationCode } from 'src/common/typeorm';
import { formatPhoneForSms } from 'src/utils/format-phone-sms';
import { generateRandomPassword } from 'src/utils/random-password-generator';
import { Twilio } from 'twilio';
import { Repository } from 'typeorm';

@Injectable()
export class SmsService {
  private client: Twilio;

  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationRepo: Repository<VerificationCode>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  // SMS gönder(Şu anlık çalışmıyor)
  async sendSms(to: string, message: string) {
    return this.client.messages.create({
      to,
      from: process.env.TWILIO_PHONE,
      body: message,
    });
  }
  // OTP veya PASSWORD üret ve gönder
  async sendCode(rawPhone: string) {
    const phoneNumber = formatPhoneForSms(rawPhone);

    const code = generateRandomPassword(4); // 4 haneli kod
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 dk

    // Varsa update et, yoksa insert
    const existing = await this.verificationRepo.findOne({
      where: { phoneNumber },
    });

    if (existing) {
      existing.code = code;
      existing.expiresAt = expiresAt;
      existing.isUsed = false;

      await this.verificationRepo.save(existing);
    } else {
      const newEntry = this.verificationRepo.create({
        phoneNumber,
        code,
        expiresAt,
        isUsed: false,
      });
      await this.verificationRepo.save(newEntry);
    }

    // SMS metni
    // const message = `Giriş doğrulama kodunuz: ${code}\nBu kod 5 dakika geçerlidir.`;
    // await this.sendSms(phoneNumber, message);

    return {
      success: true,
      phoneNumber,
      code, // Test için döndürülüyor, prod'da kaldır
    };
  }

  async verifyCode(phone: string, code: string) {
    const formatted = formatPhoneForSms(phone);

    const record = await this.verificationRepo.findOne({
      where: { phoneNumber: formatted, code, isUsed: false },
    });

    if (!record) {
      return { success: false, message: 'Kod yanlış.' };
    }

    if (record.expiresAt.getTime() < Date.now()) {
      return { success: false, message: 'Kodun süresi dolmuş.' };
    }

    record.isUsed = true;
    await this.verificationRepo.save(record);

    return { success: true };
  }
}
