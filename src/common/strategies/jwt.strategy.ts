import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../payloads/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
    });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined!');
    }
  }

  async validate(payload: JwtPayload) {
    //! User kontrolü eklenebilir.
    // const user = await this.usersService.findById(payload.sub);

    // if (!user || !user.isActive) {
    //   throw new UnauthorizedException('User not active or not found');
    // }

    // // (Opsiyonel) tenant kontrolü
    // if (user.tenant_id !== payload.tenant_id) {
    //   throw new UnauthorizedException('Tenant mismatch');
    // }

    return {
      userId: payload.sub,
      role: payload.role,
      tenantId: payload.tenant_id,
    };
  }
}
