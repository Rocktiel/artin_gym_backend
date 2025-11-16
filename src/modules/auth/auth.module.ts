import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { MemberEntity, TenantEntity, UserEntity } from 'src/common/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TenantEntity, MemberEntity]),
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard],
})
export class AuthModule {}
