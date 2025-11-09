import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/common/payloads/jwt.payload';

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

    const user = request.user as JwtPayload;

    // Eğer anahtar (data) belirtilmişse, o özelliği döndür.
    // Örneğin: data = 'tenant_id'
    // Anahtar belirtilmemişse, tüm kullanıcı (payload) objesini döndür.

    return data ? user?.[data] : user;
  },
);
