// src/common/decorators/get-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/common/payloads/jwt.payload'; // JwtPayload tipini import edin

/**
 * Request objesinden (req.user) JWT payload'ını veya payload'un belirli bir özelliğini (anahtarını) çeker.
 * * Kullanım:
 * @GetUser() user: JwtPayload         // Tüm payload'ı alır
 * @GetUser('tenant_id') tenantId: string // Sadece 'tenant_id' alanını alır
 */
export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    // HTTP isteğini al
    const request = ctx.switchToHttp().getRequest();

    // JWT Guard, doğrulanan payload'ı request.user'a eklemiş olmalı
    const user = request.user as JwtPayload;

    if (data) {
      // Eğer anahtar (data) belirtilmişse, o özelliği döndür.
      // Örneğin: data = 'tenant_id'
      return user[data];
    }

    // Anahtar belirtilmemişse, tüm kullanıcı (payload) objesini döndür.
    return user;
  },
);
