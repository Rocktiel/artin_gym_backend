import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenantEntities';
import { User } from './entities/userEntity';
import { Member } from './entities/memberEntity';
import { Package } from './entities/packageEntity';
import { Membership } from './entities/membershipEntity';
import { QrToken } from './entities/qrTokenEntity';
import { Checkin } from './entities/checkinEntity';
import { AuthModule } from './modules/auth/auth.module';
import { QrModule } from './modules/qr/qr.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +(process.env.DB_PORT || 5432),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [Tenant, User, Member, Package, Membership, QrToken, Checkin],
        synchronize: false, // prod güvenli
      }),
    }),
    AuthModule,
    QrModule,
  ],
})
export class AppModule { }
