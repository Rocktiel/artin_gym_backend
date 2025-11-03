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

  // JWT'nin benzersiz kimlik belirleyicisi (jti)
  @Column({ unique: true })
  jti: string;

  // JWT'nin geçerlilik süresi
  @Column({ type: 'timestamptz' })
  exp: Date;

  // Token'ın kullanıldığı zaman
  @Column({ type: 'timestamptz', nullable: true })
  used_at?: Date;
}
