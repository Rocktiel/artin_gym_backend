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

import { MemberEntity, TenantEntity, UserEntity } from 'src/common/typeorm';
import { UserTypes } from 'src/common/enums/UserTypes.enums';
import { RegisterMemberRequestDto } from './dto/request/register-member.request.dto';
import { RegisterRequestDto } from './dto/request/register.request.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TenantEntity) private tenants: Repository<TenantEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
      relations: ['tenant'],
    });

    if (!user) throw new UnauthorizedException('User not found');
    if (!user.isActive) throw new UnauthorizedException('User not active');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('User not found');

    if (!user.tenant && user.role !== UserTypes.SUPER_ADMIN) {
      // SUPER_ADMIN değilse ve tenant yoksa (ki olmamalı) hata verilebilir
      throw new UnauthorizedException('Tenant information missing');
    }

    const payload: JwtPayload = {
      sub: user.id.toString(),
      role: user.role,
      ...(user.tenant ? { tenant_id: user.tenant.id.toString() } : {}),
    };

    const accessToken = await this.jwtService.signAsync(payload);

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    if (user.role === UserTypes.SUPER_ADMIN) {
      return {
        success: true,
        access_token: accessToken,
        user: {
          id: user.id,
          role: user.role,
        },
      };
    }

    return {
      success: true,
      access_token: accessToken,
      user: {
        id: user.id,
        role: user.role,
        tenant_id: user.tenantId,
      },
    };
  }

  // Yeni tenant oluşturur
  async register(dto: RegisterRequestDto) {
    // Username kontrolü
    const existingUser = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUser) {
      throw new BadRequestException('Bu username zaten kullanılmakta.');
    }

    // Tenant kontrolü
    const existingTenant = await this.tenants.findOne({
      where: { name: dto.tenantName },
    });
    if (existingTenant) {
      throw new BadRequestException(
        `“${dto.tenantName}” adında bir işletme zaten mevcut.`,
      );
    }

    // Yeni tenant oluştur
    const tenant = this.tenants.create({
      name: dto.tenantName,
      address: dto.address,
      phoneNumber: dto.phoneNumber,
    });
    await this.tenants.save(tenant);

    // Parola hash
    const hash = await bcrypt.hash(dto.phoneNumber, 10);

    // Kullanıcı oluştur
    const user = this.userRepository.create({
      username: dto.username,
      password: hash,
      role: UserTypes.COMPANY_ADMIN,
      tenant,
    });

    // Kaydet
    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      username: savedUser.username,
    };
  }

  // Yeni member kaydı oluşturur
  async registerMember(
    dto: RegisterMemberRequestDto,
    tenantId: string, // Yöneticinin ait olduğu tenant ID'si
  ) {
    // 1. PhoneNumber Kontrolü
    if (
      await this.userRepository.findOne({
        where: { username: dto.phoneNumber },
      })
    ) {
      throw new BadRequestException(
        'Bu PhoneNumber adresi zaten kullanılmakta.',
      );
    }

    // 2. Parola Hash
    const hash = await bcrypt.hash(dto.password, 10);

    // 3. Kullanıcı Oluştur (Role: MEMBER)
    const newUser = this.userRepository.create({
      username: dto.phoneNumber,
      password: hash,
      role: UserTypes.MEMBER, //Rol MEMBER olacak
      tenantId: tenantId,
      isActive: true, // Varsayılan olarak aktif
    });
    const savedUser = await this.userRepository.save(newUser);

    // 4. Member Oluştur
    const newMember = this.memberRepository.create({
      tenantId: tenantId,
      userId: savedUser.id.toString(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      emergencyContact: dto.emergencyContact,
      status: 'active',
      physicalData: dto.physicalData,
      // diğer alanlar...
    });
    await this.memberRepository.save(newMember);

    // 5. Başarı Yanıtı
    return {
      memberId: newMember.id,
      userId: savedUser.id,
      tenantId: tenantId,
      username: savedUser.username,
    };
  }

  async changePassword(userId: number, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await this.userRepository.save(user);
  }
}
