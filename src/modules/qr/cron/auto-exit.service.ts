import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { EntryEntity } from 'src/common/typeorm/entry.entity';
import { EntryType, EntryStatus } from 'src/common/enums/Entry.enums';

@Injectable()
export class AutoExitService {
  private readonly logger = new Logger(AutoExitService.name);

  constructor(
    @InjectRepository(EntryEntity)
    private readonly entryRepo: Repository<EntryEntity>,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async autoExitMembers() {
    this.logger.log('Running auto-exit cron...');

    // Denemek için 1 dakika 3 saat için:  3 * 60 * 60 * 1000
    const threeHoursAgo = new Date(Date.now() - 1 * 60 * 1000);

    // 3 saatten eski tüm ENTRY'leri çek
    const oldEntries = await this.entryRepo.find({
      where: {
        entryType: EntryType.ENTRY,
        status: EntryStatus.SUCCESS,
        timestampUtc: LessThan(threeHoursAgo),
      },
    });

    for (const entry of oldEntries) {
      // Bu ENTRY’den sonra EXIT yapıldı mı kontrol et
      const newerExit = await this.entryRepo.findOne({
        where: {
          memberId: entry.memberId,
          tenantId: entry.tenantId,
          entryType: EntryType.EXIT,
          status: EntryStatus.SUCCESS,
          timestampUtc: MoreThan(entry.timestampUtc),
        },
      });

      // EXIT varsa - otomatik çıkış yapma
      if (newerExit) {
        continue;
      }

      // EXIT yoksa - otomatik çıkış oluştur
      const exitRecord = this.entryRepo.create({
        memberId: entry.memberId,
        tenantId: entry.tenantId,
        entryType: EntryType.EXIT,
        status: EntryStatus.SUCCESS,
        timestampUtc: new Date(),
      });

      await this.entryRepo.save(exitRecord);

      this.logger.warn(
        `Auto EXIT created for Member ${entry.memberId} (Tenant ${entry.tenantId})`,
      );
    }
  }
}
