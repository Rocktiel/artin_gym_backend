import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { QrModule } from './modules/qr/qr.module';

@Module({
  imports: [AuthModule, QrModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
