import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryEntity, MemberEntity, QrToken } from 'src/common/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([QrToken, MemberEntity, EntryEntity])],
  controllers: [QrController],
  providers: [QrService, RolesGuard],
})
export class QrModule {}
