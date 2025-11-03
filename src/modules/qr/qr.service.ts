import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { EntryStatus, EntryType } from 'src/common/enums/Entry.enums';
import { MemberEntity } from 'src/common/typeorm';
import { EntryEntity } from 'src/common/typeorm/entry.entity';
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
    @InjectRepository(EntryEntity)
    private readonly entryRepo: Repository<EntryEntity>,
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
    let qr: QrToken | null | undefined;
    let entryStatus = EntryStatus.FAIL_INVALID;
    let failureReason: string | undefined;

    try {
      decoded = this.jwtService.verify(token);
    } catch (err) {
      failureReason = 'JWT is invalid or expired.';
      // Hata Yönetimi: Entry'i kaydet (FAIL)
      await this.logEntryFailure(
        decoded?.sub,
        decoded?.tenant_id,
        failureReason,
        EntryStatus.FAIL_EXPIRED,
      );
      throw new UnauthorizedException(failureReason);
    }

    const { jti, sub: memberId, tenant_id } = decoded;

    try {
      qr = await this.qrTokenRepo.findOne({
        where: { jti, member: { id: memberId }, tenant: { id: tenant_id } },
        relations: ['member', 'tenant'],
      });

      if (!qr) {
        failureReason = 'QR record not found in database.';
        throw new ForbiddenException(failureReason);
      }

      // 1. Zaten Kullanılmışsa
      if (qr.used_at) {
        failureReason = 'QR already used.';
        throw new ForbiddenException(failureReason);
      }

      // 2. Süresi Dolmuşsa (DB Kontrolü)
      if (qr.exp < new Date()) {
        failureReason = 'QR expired.';
        throw new ForbiddenException(failureReason);
      }

      // --- BAŞARILI DURUM ---

      // QR Token'ı Kullanıldı olarak işaretle
      qr.used_at = new Date();
      await this.qrTokenRepo.save(qr);

      // Entry Kaydı (SUCCESS)
      await this.logEntrySuccess(
        qr.member.id.toString(),
        qr.tenant.id.toString(),
        EntryType.ENTRY,
      );

      return {
        success: true,
        message: 'QR verified successfully.',
        memberId,
        tenantId: tenant_id,
      };
    } catch (error) {
      // Hata Yönetimi: Entry'i kaydet (FAIL)
      await this.logEntryFailure(
        memberId,
        tenant_id.toString(),
        failureReason || error.message,
        entryStatus,
      );
      throw error; // Orijinal hatayı fırlat
    }
  }

  // --- Yardımcı Fonksiyonlar ---

  // Başarılı Giriş Kaydı
  private async logEntrySuccess(
    memberId: string,
    tenantId: string,
    entryType: EntryType,
  ) {
    const entry = this.entryRepo.create({
      memberId,
      tenantId,
      entryType,
      status: EntryStatus.SUCCESS,
      timestampUtc: new Date(),
    });
    await this.entryRepo.save(entry);
  }

  // Başarısız Giriş Kaydı
  private async logEntryFailure(
    memberId: string | undefined,
    tenantId: string | undefined,
    reason: string,
    status: EntryStatus,
  ) {
    // Member veya Tenant ID'leri decoded'dan geldiyse kaydet
    const entry = this.entryRepo.create({
      memberId: memberId || 'UNKNOWN',
      tenantId: tenantId || 'UNKNOWN',
      entryType: EntryType.ENTRY, // Başarısız da olsa ENTRY denemesi
      status: status,
      failureReason: reason,
      timestampUtc: new Date(),
    });
    await this.entryRepo.save(entry);
  }
}
