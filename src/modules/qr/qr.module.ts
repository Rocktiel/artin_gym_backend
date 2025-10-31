import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrToken } from '../../entities/qrTokenEntity';
import { Membership } from '../../entities/membershipEntity';
import { Checkin } from '../../entities/checkinEntity';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QrToken, Membership, Checkin])],
  controllers: [QrController],
  providers: [QrService],
})
export class QrModule { }
