import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrToken } from '../../entities/qrTokenEntity';
import { Membership } from '../../entities/membershipEntity';
import { Checkin } from '../../entities/checkinEntity';
import { randomBytes, randomUUID } from 'crypto';

@Injectable()
export class QrService {
    constructor(
        @InjectRepository(QrToken) private qrRepo: Repository<QrToken>,
        @InjectRepository(Membership) private msRepo: Repository<Membership>,
        @InjectRepository(Checkin) private checkins: Repository<Checkin>,
    ) { }

    private isActive(m: Membership) { const now = new Date(); return now >= m.startAt && now <= m.endAt; }

    async generate(tenantId: string, memberId: string) {
        const m = await this.msRepo.findOne({ where: { tenantId, memberId }, order: { endAt: 'DESC' } as any });
        if (!m || !this.isActive(m)) throw new ForbiddenException('Membership inactive');

        const token = this.qrRepo.create({
            tenantId, memberId, jti: randomUUID(),
            code: randomBytes(32).toString('base64url'),
            expiresAt: new Date(Date.now() + 90_000),
        });
        await this.qrRepo.save(token);
        return { qr: token.code, expiresAt: token.expiresAt };
    }

    async verify(tenantId: string, code: string) {
        const token = await this.qrRepo.findOne({ where: { code } });
        if (!token || token.tenantId !== tenantId) throw new BadRequestException('Invalid QR');
        if (token.usedAt) throw new BadRequestException('Already used');
        if (token.expiresAt.getTime() < Date.now()) throw new BadRequestException('Expired');

        const m = await this.msRepo.findOne({ where: { tenantId, memberId: token.memberId }, order: { endAt: 'DESC' } as any });
        if (!m || !this.isActive(m)) throw new ForbiddenException('Membership inactive');

        await this.qrRepo.manager.transaction(async mgr => {
            await mgr.update(QrToken, { id: token.id }, { usedAt: new Date() });
            await mgr.save(mgr.create(Checkin, { tenantId, memberId: token.memberId, method: 'QR', meta: { jti: token.jti } }));
        });

        return { ok: true, memberId: token.memberId };
    }
}
