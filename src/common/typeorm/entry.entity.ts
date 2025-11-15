import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from 'src/base/entity/base.entity';
import { TenantEntity } from './tenant.entity';
import { MemberEntity } from './member.entity';

import { EntryType, EntryStatus } from '../enums/Entry.enums';

@Entity({ name: 'entries' })
@Index(['status', 'entryType', 'timestampUtc'])
export class EntryEntity extends BaseEntity {
  // Hangi işletmeye ait olduğu
  @ManyToOne(() => TenantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  // Hangi üye okuttu
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  // İşlemin Gerçekleşme Zamanı (UTC formatında)
  @Column({
    name: 'timestamp_utc',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestampUtc: Date;

  // Giriş/Çıkış Olayının Türü
  @Column({
    type: 'enum',
    enum: EntryType,
    name: 'entry_type',
    comment: 'Giriş (ENTRY) veya Çıkış (EXIT)',
  })
  entryType: EntryType;

  // İşlemin Başarılı Olup Olmadığı
  @Column({
    type: 'enum',
    enum: EntryStatus,
    name: 'status',
    default: EntryStatus.SUCCESS,
    comment: 'Erişim sonucu (Başarılı, Süresi Dolmuş, Yetkisiz vb.)',
  })
  status: EntryStatus;

  // Eğer bir işlem başarısız olduysa, neden başarısız olduğunun açıklaması.
  @Column({ name: 'failure_reason', type: 'varchar', nullable: true })
  failureReason?: string;
}
