import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/base/entity/base.entity';
import { UserEntity } from './user.entity';
import { MemberEntity } from './member.entity';
import { QrToken } from './qr-token.entity';

@Entity({ name: 'tenants' })
export class TenantEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 150, unique: true })
  name: string;

  //   @Column({ name: 'plan_type', type: 'varchar', length: 50 })
  //   planType: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ name: 'settings_json', type: 'jsonb', nullable: true })
  settingsJson?: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @OneToMany(() => UserEntity, (user) => user.tenant)
  users: UserEntity[];

  @OneToMany(() => MemberEntity, (member) => member.tenant)
  members: MemberEntity[];

  @OneToMany(() => QrToken, (qr) => qr.tenant)
  qr_tokens: QrToken[];
}
