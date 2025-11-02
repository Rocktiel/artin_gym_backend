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

  // Yeni tenant oluşturur
  async register(email: string, password: string, tenantName: string) {
    // Email kontrolü
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Bu e-posta adresi zaten kullanılmakta.');
    }

    // Tenant kontrolü
    const existingTenant = await this.tenants.findOne({
      where: { name: tenantName },
    });
    if (existingTenant) {
      throw new BadRequestException(
        `“${tenantName}” adında bir işletme zaten mevcut.`,
      );
    }

    // Yeni tenant oluştur
    const tenant = this.tenants.create({ name: tenantName });
    await this.tenants.save(tenant);

    // Parola hash
    const hash = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur
    const user = this.userRepository.create({
      email,
      password: hash,
      role: UserTypes.COMPANY_ADMIN,
      tenant,
    });

    // Kaydet
    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
    };
  }
}
