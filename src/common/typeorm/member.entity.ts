// src/common/typeorm/entities/member.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/base/entity/base.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';
import { QrToken } from './qr-token.entity';
import { PackageEntity } from './package.entity';
import { MembershipEntity } from './membership.entity';

@Entity({ name: 'members' })
export class MemberEntity extends BaseEntity {
  // Üyenin bağlı olduğu tenant(salon).
  @ManyToOne(() => TenantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  // Üyenin bağlı olduğu kullanıcı hesabı.
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  // Üyenin adı
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  // Üyenin soyadı
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  // Üyenin telefon numarası
  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  // Acil durumda aranacak kişi
  @Column({
    name: 'emergency_contact',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  emergencyContact?: string;

  // Üyenin profil fotoğrafı URL'si
  @Column({ name: 'profile_photo_url', type: 'varchar', nullable: true })
  profilePhotoUrl?: string;

  // Üyenin aktiflik durumu
  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  // Üyenin doğum tarihi
  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  // Üyenin fiziksel verileri
  @Column({
    name: 'physical_data',
    type: 'jsonb',
    nullable: true,
  })
  physicalData?: {
    heightCm?: number;
    weightKg?: number;
    bodyFatPercentage?: number;
    targetWeightKg?: number;
    bmi?: number;
    // İleride eklenecek tüm diğer ölçümler buraya eklenecek
  };

  // Üyenin sahip olduğu QR tokenları
  @OneToMany(() => QrToken, (qr) => qr.member)
  qr_tokens: QrToken[];

  // Üyenin mevcut üyelik
  @OneToMany(() => MembershipEntity, (membership) => membership.member)
  memberships: MembershipEntity[];
}
