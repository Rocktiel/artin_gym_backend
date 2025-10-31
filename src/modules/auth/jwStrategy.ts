import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
    sub: string;
    tenant_id: string;
    role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // ENV undefined olursa default veriyoruz:
            secretOrKey: process.env.JWT_SECRET ?? 'supersecretkey',
        });
    }

    // DİKKAT: async + tipi belirttik; gövde tek return
    async validate(payload: JwtPayload) {
        return {
            userId: payload.sub,
            role: payload.role,
            tenantId: payload.tenant_id,
        };
    }
}
