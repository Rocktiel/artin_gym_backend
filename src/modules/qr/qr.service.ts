import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { EntryStatus, EntryType } from 'src/common/enums/Entry.enums';
import { ResponseMessages } from 'src/common/enums/ResponseMessages.enum';
import { MemberEntity } from 'src/common/typeorm';
import { EntryEntity } from 'src/common/typeorm/entry.entity';
import { QrToken } from 'src/common/typeorm/qr-token.entity';
import { Repository } from 'typeorm';
import { AutoExitProducer } from './cron/auto-exit.producer';

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

    private readonly autoExitProducer: AutoExitProducer,
  ) {}

  // QR Token üretir
  async generateQrToken(memberId: number) {
    const member = await this.memberRepo.findOne({
      where: { id: memberId },
      relations: ['tenant'],
    });

    if (!member)
      throw new UnauthorizedException(ResponseMessages.MEMBER_NOT_FOUND);

    const payload = {
      sub: member.id,
      tenant_id: member.tenant.id,
      jti: crypto.randomUUID(),
    };

    const expiresIn = '2m'; // 2 dakikalık QR geçerliliği
    const token = this.jwtService.sign(payload, { expiresIn });

    // DB’ye kaydet (QR)
    const qrEntity = this.qrTokenRepo.create({
      tenant: member.tenant,
      member,
      jti: payload.jti,
      exp: new Date(Date.now() + 2 * 60 * 1000), // 2 dakika
    });

    await this.qrTokenRepo.save(qrEntity);

    return {
      token,
    };
  }

  // QR Token doğrular
  async verifyQrToken(token: string) {
    let decoded: any;
    let qr: QrToken | null | undefined;
    let failureReason: string | undefined;

    try {
      decoded = this.jwtService.verify(token);
    } catch (err) {
      failureReason = 'JWT is invalid or expired.';

      // Fail -> ENTRY olarak kaydet
      await this.entryRepo.save(
        this.entryRepo.create({
          memberId: decoded?.sub || 'UNKNOWN',
          tenantId: decoded?.tenant_id || 'UNKNOWN',
          entryType: EntryType.ENTRY,
          status: EntryStatus.FAIL_EXPIRED,
          failureReason,
          timestampUtc: new Date(),
        }),
      );

      throw new UnauthorizedException(failureReason);
    }

    const { jti, sub: memberId, tenant_id } = decoded;

    try {
      // QR DB Kontrolü
      qr = await this.qrTokenRepo.findOne({
        where: { jti, member: { id: memberId }, tenant: { id: tenant_id } },
        relations: ['member', 'tenant'],
      });

      // QR yoksa hata
      if (!qr) {
        failureReason = 'QR record not found in database.';
        throw new ForbiddenException(failureReason);
      }

      // QR kullanıldıysa hata
      if (qr.used_at) {
        failureReason = 'QR already used.';
        throw new ForbiddenException(failureReason);
      }

      // QR gecersizse hata
      if (qr.exp < new Date()) {
        failureReason = 'QR expired.';
        throw new ForbiddenException(failureReason);
      }

      // Kullanıldı işaretle
      qr.used_at = new Date();
      await this.qrTokenRepo.save(qr);

      const member = qr.member;
      // Son işlem
      const lastEntry = await this.entryRepo.findOne({
        where: {
          memberId: memberId.toString(),
          tenantId: tenant_id.toString(),
          status: EntryStatus.SUCCESS,
        },
        order: { timestampUtc: 'DESC' },
      });

      // EXIT YAPMA

      if (lastEntry && lastEntry.entryType === EntryType.ENTRY) {
        await this.entryRepo.save(
          this.entryRepo.create({
            memberId: memberId.toString(),
            tenantId: tenant_id.toString(),
            entryType: EntryType.EXIT,
            status: EntryStatus.SUCCESS,
            timestampUtc: new Date(),
          }),
        );

        // Member inside durumunu false yap
        member.isInside = false;
        await this.memberRepo.save(member);

        // Otomatik EXIT oluşturma Job kaldırır
        await this.autoExitProducer.removeAutoExitJob(memberId.toString());

        return {
          message: 'EXIT recorded.',
          entryType: EntryType.EXIT,
          memberId,
          tenantId: tenant_id,
        };
      }

      // ENTRY YAPMA

      await this.entryRepo.save(
        this.entryRepo.create({
          memberId: memberId.toString(),
          tenantId: tenant_id.toString(),
          entryType: EntryType.ENTRY,
          status: EntryStatus.SUCCESS,
          timestampUtc: new Date(),
        }),
      );

      // Member inside durumunu true yap
      member.isInside = true;
      await this.memberRepo.save(member);

      // Otomatik EXIT oluşturma Job ekler
      await this.autoExitProducer.addAutoExitJob(
        memberId.toString(),
        tenant_id.toString(),
        1 * 60 * 1000, // 1 dakika test için
      );

      return {
        message: 'ENTRY recorded.',
        entryType: EntryType.ENTRY,
        memberId,
        tenantId: tenant_id,
      };
    } catch (error) {
      // BURADA HANGİ İŞLEMİN DENENDİĞİNİ ANLAYIP DOĞRU TYPE'ı YAZACAĞIZ

      // Default ENTRY
      let failedEntryType = EntryType.ENTRY;

      // aktif son işlem ENTRY ise NOW yapılacak işlem EXIT olur → error durumunda EXIT FAIL yazılmalı
      const lastOp = await this.entryRepo.findOne({
        where: {
          memberId: memberId.toString(),
          tenantId: tenant_id.toString(),
        },
        order: { timestampUtc: 'DESC' },
      });

      if (lastOp && lastOp.entryType === EntryType.ENTRY) {
        failedEntryType = EntryType.EXIT;
      }

      // FAIL kaydı
      await this.entryRepo.save(
        this.entryRepo.create({
          memberId: memberId || 'UNKNOWN',
          tenantId: tenant_id?.toString() || 'UNKNOWN',
          entryType: failedEntryType,
          status: EntryStatus.FAIL_INVALID,
          failureReason: failureReason || error.message,
          timestampUtc: new Date(),
        }),
      );

      throw error;
    }
  }
}
