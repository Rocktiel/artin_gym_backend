import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../payloads/jwt.payload';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token bulunamadı.');
    }

    try {
      // Token doğrulama
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // Request'e user bilgisini ekle
      (request as any).user = payload;

      return true;
    } catch (error) {
      // Farklı JWT hatalarına göre mesaj döndür
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
        );
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Geçersiz token.');
      }

      throw new UnauthorizedException('Kimlik doğrulama başarısız.');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
