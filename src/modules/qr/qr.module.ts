import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryEntity, MemberEntity, QrToken } from 'src/common/typeorm';
import { AutoExitProducer } from './cron/auto-exit.producer';
import { BullModule } from '@nestjs/bullmq';
import { AutoExitConsumer } from './cron/auto-exit.consumer';
// import { AutoExitService } from './cron/auto-exit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QrToken, MemberEntity, EntryEntity]),

    BullModule.registerQueue({
      name: 'auto-exit',
    }),
  ],
  controllers: [QrController],
  providers: [QrService, RolesGuard, AutoExitProducer, AutoExitConsumer],
})
export class QrModule {}
