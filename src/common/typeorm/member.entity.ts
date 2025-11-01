// src/common/typeorm/entities/member.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/base/entity/base.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';
import { QrToken } from './qr-token.entity';

@Entity({ name: 'members' })
export class MemberEntity extends BaseEntity {
  @ManyToOne(() => TenantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({
    name: 'emergency_contact',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  emergencyContact?: string;

  @Column({ name: 'profile_photo_url', type: 'varchar', nullable: true })
  profilePhotoUrl?: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @OneToMany(() => QrToken, (qr) => qr.member)
  qr_tokens: QrToken[];
}
