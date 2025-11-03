import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from 'src/base/entity/base.entity';
import { TenantEntity } from './tenant.entity';
import { PackageDurationType, PackageStatus } from '../enums/Package.enum';

@Entity({ name: 'packages' })
@Index(['tenantId', 'status', 'packageName'])
export class PackageEntity extends BaseEntity {
  // Hangi işletmeye ait olduğu
  @ManyToOne(() => TenantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  // Paket Adı (Örn: Standart Aylık Üyelik)
  @Column({ name: 'package_name', type: 'varchar', length: 150 })
  packageName: string;

  // Paketin Kısa Açıklaması
  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  // Satış Fiyatı
  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // Paketin Geçerlilik Süresi (Sayısal Değer)
  @Column({ name: 'duration_value', type: 'int' })
  durationValue: number;

  // Süre Birimi (Gün, Ay, Yıl)
  @Column({
    type: 'enum',
    enum: PackageDurationType,
    name: 'duration_type',
    default: PackageDurationType.MONTH,
  })
  durationType: PackageDurationType;

  // Paket Durumu (Aktif/Pasif)
  @Column({
    type: 'enum',
    enum: PackageStatus,
    name: 'status',
    default: PackageStatus.ACTIVE,
  })
  status: PackageStatus;

  // Sınırsız giriş hakkı olup olmadığı
  @Column({ name: 'is_unlimited_access', type: 'boolean', default: true })
  isUnlimitedAccess: boolean;

  // Üyenin bu paketi dondurma hakkı var mı?
  @Column({ name: 'can_be_frozen', type: 'boolean', default: false })
  canBeFrozen: boolean;
}
