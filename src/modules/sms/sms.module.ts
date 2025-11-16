import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, VerificationCode } from 'src/common/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationCode, UserEntity]), // ❗ sadece Entity burada
  ],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
