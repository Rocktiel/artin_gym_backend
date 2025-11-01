import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from 'src/common/typeorm';
import { QrToken } from 'src/common/typeorm/qr-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QrService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(QrToken)
    private readonly qrTokenRepo: Repository<QrToken>,
    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
  ) {}

  // QR Token üretir

  async generateQrToken(memberId: number) {
    const member = await this.memberRepo.findOne({
      where: { id: memberId },
      relations: ['tenant'],
    });

    if (!member) throw new UnauthorizedException('Member not found.');

    const payload = {
      sub: member.id,
      tenant_id: member.tenant.id,
      jti: crypto.randomUUID(),
    };

    const expiresIn = '5m'; // 5 dakikalık QR geçerliliği
    const token = this.jwtService.sign(payload, { expiresIn });

    // DB’ye kaydet
    const qrEntity = this.qrTokenRepo.create({
      tenant: member.tenant,
      member,
      jti: payload.jti,
      exp: new Date(Date.now() + 5 * 60 * 1000), // 5 dakika
    });

    await this.qrTokenRepo.save(qrEntity);

    return {
      success: true,
      message: 'QR generated successfully.',
      token,
    };
  }

  // QR Token doğrular

  async verifyQrToken(token: string) {
    let decoded: any;
    try {
      decoded = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired QR token.');
    }

    const { jti, sub: memberId, tenant_id } = decoded;

    const qr = await this.qrTokenRepo.findOne({
      where: { jti, member: { id: memberId }, tenant: { id: tenant_id } },
      relations: ['member', 'tenant'],
    });

    if (!qr) throw new ForbiddenException('QR not found.');
    if (qr.used_at) throw new ForbiddenException('QR already used.');
    if (qr.exp < new Date()) throw new ForbiddenException('QR expired.');

    // Kullanıldı olarak işaretle
    qr.used_at = new Date();
    await this.qrTokenRepo.save(qr);

    return {
      success: true,
      message: 'QR verified successfully.',
      memberId,
      tenantId: tenant_id,
    };
  }
}
