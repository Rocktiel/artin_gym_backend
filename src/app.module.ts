import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { QrModule } from './modules/qr/qr.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { LoggerService } from './common/logger/logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import databaseConfig from './common/config/database.config';
import jwtConfig from './common/config/jwt.config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),

    PassportModule,

    // Global JWT setup
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => {
        const secret = configService.get<string>('jwt_service.secret');
        const expiresIn =
          configService.get<string>('jwt_service.accessTokenExpiresIn') ??
          '15m';

        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
      inject: [ConfigService],
      global: true,
    }),

    //Feature modules
    AuthModule,
    QrModule,
  ],

  providers: [
    LoggerService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
