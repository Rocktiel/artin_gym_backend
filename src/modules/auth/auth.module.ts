import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './authService';
import { AuthController } from './auth.controller';
import { User } from '../../entities/userEntity';
import { Tenant } from '../../entities/tenantEntities';
import { JwtStrategy } from './jwStrategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'supersecretkey',
      // not: bazı tip karmaşalarını önlemek için burada set ediyoruz
      signOptions: { expiresIn: (process.env.JWT_EXPIRES ?? '15m') as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
