import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { LoginRequestDto } from './dto/request/login.request.dto';
import { JwtPayload } from 'src/common/payloads/jwt.payload';

import { TenantEntity, UserEntity } from 'src/common/typeorm';
import { UserTypes } from 'src/common/enums/UserTypes.enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TenantEntity) private tenants: Repository<TenantEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['tenant'],
    });

    if (!user) throw new UnauthorizedException('User not found');
    if (!user.isActive) throw new UnauthorizedException('User not active');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('User not found');

    const payload: JwtPayload = {
      sub: user.id.toString(),
      role: user.role,
      tenant_id: user.tenant.id.toString(),
    };

    const accessToken = await this.jwtService.signAsync(payload);

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return {
      success: true,
      access_token: accessToken,
      user: {
        id: user.id,
        role: user.role,
        tenant: user.tenant.name,
      },
    };
  }

  async register(email: string, password: string, tenantName: string) {
    if (await this.userRepository.findOne({ where: { email } }))
      throw new BadRequestException('Email used');
    const tenant = await this.tenants.save({ name: tenantName });
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.save({
      email,
      password: hash,
      role: UserTypes.COMPANY_ADMIN,
      tenant_id: tenant.id,
    });
    return { id: user.id, email: user.email };
  }
}
