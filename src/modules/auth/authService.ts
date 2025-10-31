import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/userEntity';
import { Tenant } from '../../entities/tenantEntities';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../../entities/enums';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private users: Repository<User>,
        @InjectRepository(Tenant) private tenants: Repository<Tenant>,
        private jwt: JwtService,
    ) { }

    async register(email: string, password: string, tenantName: string) {
        if (await this.users.findOne({ where: { email } })) throw new BadRequestException('Email used');
        const tenant = await this.tenants.save({ name: tenantName });
        const hash = await bcrypt.hash(password, 10);
        const user = await this.users.save({ email, password: hash, role: Role.COMPANY_ADMIN, tenantId: tenant.id });
        return { id: user.id, email: user.email };
    }

    async login(email: string, password: string) {
        const user = await this.users.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException('Invalid');
        const payload = { sub: user.id, tenant_id: user.tenantId, role: user.role };
        const expiresIn = process.env.JWT_EXPIRES ?? '15m';
        const access_token = await this.jwt.signAsync(payload);
        return { access_token, expires_in: process.env.JWT_EXPIRES ?? '15m' };;
        return { access_token, expires_in: expiresIn };


        return { access_token, expires_in: process.env.JWT_EXPIRES };
    }
}
