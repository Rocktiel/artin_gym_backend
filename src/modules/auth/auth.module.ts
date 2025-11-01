import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { TenantEntity, UserEntity } from 'src/common/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TenantEntity]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard],
})
export class AuthModule {}
