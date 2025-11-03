import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { TenantEntity } from './tenant.entity';
import { MemberEntity } from './member.entity';
import { BaseEntity } from 'src/base/entity/base.entity';
import { PackageEntity } from './package.entity';

@Entity({ name: 'memberships' })
export class MembershipEntity extends BaseEntity {
  @ManyToOne(() => TenantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => MemberEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @ManyToOne(() => PackageEntity)
  @JoinColumn({ name: 'package_id' })
  package: PackageEntity;

  @Column({ name: 'package_id', type: 'uuid' })
  packageId: string;

  @Column({ name: 'start_at', type: 'timestamp with time zone' })
  startAt: Date;

  @Column({ name: 'end_at', type: 'timestamp with time zone' })
  endAt: Date;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ name: 'used_entries', type: 'int', default: 0 })
  usedEntries: number;
}
