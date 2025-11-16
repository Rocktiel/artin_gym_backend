import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from 'src/base/entity/base.entity';
@Entity('verification_codes')
@Index(['phoneNumber'], { unique: true })
export class VerificationCode extends BaseEntity {
  // Telefon numarası +90555... formatında tutuluyor
  @Column()
  phoneNumber: string;

  // 4 haneli OTP kodu
  @Column()
  code: string;

  // Süresi: örn. 3 dakika
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  // Kod kullanıldı mı?
  @Column({ default: false })
  isUsed: boolean;
}
