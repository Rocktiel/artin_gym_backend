import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserTypes } from '../enums/UserTypes.enums';
import { TenantEntity } from './tenant.entity';
import { BaseEntity } from 'src/base/entity/base.entity';

@Entity({ name: 'users' })
@Index(['email'], { unique: true })
export class UserEntity extends BaseEntity {
  // Kullanıcının e-posta adresi.Tüm sistemde unique olmalı.
  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  // Hash'lenmiş parola (bcrypt ile).
  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  // Kullanıcının bağlı olduğu tenant(salon).
  @ManyToOne(() => TenantEntity, (tenant) => tenant.users, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId: string;

  // Hesap aktif mi?
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // En son giriş zamanı.
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  // Kullanıcı rolü — enum olarak tutulur.
  @Column({
    type: 'enum',
    enum: UserTypes,
    default: UserTypes.MEMBER,
  })
  role: UserTypes;
}
