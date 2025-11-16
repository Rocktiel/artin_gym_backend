import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { EntryEntity } from 'src/common/typeorm/entry.entity';
import { Repository } from 'typeorm';
import { EntryType, EntryStatus } from 'src/common/enums/Entry.enums';
import { MemberEntity } from 'src/common/typeorm';

@Processor('auto-exit')
export class AutoExitConsumer extends WorkerHost {
  constructor(
    @InjectRepository(EntryEntity)
    private readonly entryRepo: Repository<EntryEntity>,

    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
  ) {
    super();
  }

  async process(job: any): Promise<void> {
    const { memberId, tenantId } = job.data;

    const lastEntry = await this.entryRepo.findOne({
      where: { memberId, tenantId },
      relations: ['member'],
      order: { timestampUtc: 'DESC' },
    });

    // Son işlem EXIT ise (veya kayıt yoksa) - hiçbir şey yapma
    if (!lastEntry || lastEntry.entryType === EntryType.EXIT) return;

    // Member kontrol et
    const member = lastEntry.member;
    if (!member) {
      console.error(`ERROR: Member not found for entry ${lastEntry.id}`);
      return; // Member yüklenemediyse devam etme
    }

    // Otomatik EXIT oluştur
    await this.entryRepo.save(
      this.entryRepo.create({
        memberId,
        tenantId,
        entryType: EntryType.EXIT,
        status: EntryStatus.SUCCESS,
        timestampUtc: new Date(),
      }),
    );

    // Member'ın isInside durumunu güncelle
    member.isInside = false;
    await this.memberRepo.save(member);

    console.log(`Auto EXIT executed for member ${memberId}`);
  }
}
