import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrToken } from 'src/common/typeorm/qr-token.entity';
import { MemberEntity } from 'src/common/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([QrToken, MemberEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [QrController],
  providers: [QrService, RolesGuard],
})
export class QrModule {}
