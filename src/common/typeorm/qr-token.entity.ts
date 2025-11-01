import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/base/entity/base.entity';
import { TenantEntity } from './tenant.entity';
import { MemberEntity } from './member.entity';

@Entity('qr_tokens')
export class QrToken extends BaseEntity {
  @ManyToOne(() => TenantEntity, (tenant) => tenant.qr_tokens, {
    onDelete: 'CASCADE',
  })
  tenant: TenantEntity;

  @ManyToOne(() => MemberEntity, (member) => member.qr_tokens, {
    onDelete: 'CASCADE',
  })
  member: MemberEntity;

  @Column({ unique: true })
  jti: string;

  @Column({ type: 'timestamptz' })
  exp: Date;

  @Column({ type: 'timestamptz', nullable: true })
  used_at?: Date;
}
