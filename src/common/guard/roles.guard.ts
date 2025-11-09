import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserTypes } from '../enums/UserTypes.enums';
import { JwtPayload } from '../payloads/jwt.payload';
import { ResponseMessages } from '../enums/ResponseMessages.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Endpoint'e izin verilen roller
    const requiredRoles = this.reflector.getAllAndOverride<UserTypes[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      // Eğer @Roles decorator yoksa -> herkese açık endpoint
      return true;
    }

    // Request al
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        ResponseMessages.INVALID_OR_EXPIRED_TOKEN,
      );
    }

    try {
      // JWT doğrulama
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // Request’e user bilgisini ekle (controller içinde erişilebilir)
      (request as any).user = payload;

      // SUPER_ADMIN her şeye erişebilir
      if (payload.role === UserTypes.SUPER_ADMIN) return true;

      // Roller uyuşuyor mu?
      const hasAccess = requiredRoles.includes(payload.role);
      if (!hasAccess) {
        throw new ForbiddenException(ResponseMessages.FORBIDDEN_NO_ACCESS);
      }

      return true;
    } catch (error) {
      // Token geçersiz, süresi dolmuş vs.
      throw new UnauthorizedException(
        ResponseMessages.INVALID_OR_EXPIRED_TOKEN,
      );
    }
  }

  // Authorization header'dan "Bearer <token>" formatındaki token'ı çeker.

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
