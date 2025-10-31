import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Tenant } from './tenantEntities';
import { Membership } from './membershipEntity';
import { QrToken } from './qrTokenEntity';
import { Checkin } from './checkinEntity';

@Entity('members')
export class Member {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column() @Index() tenantId: string;
    @ManyToOne(() => Tenant, t => t.members) tenant: Tenant;

    @Column() fullName: string;
    @Column({ nullable: true, unique: true }) email?: string;
    @Column({ nullable: true }) phone?: string;

    @CreateDateColumn() createdAt: Date;

    @OneToMany(() => Membership, m => m.member) memberships: Membership[];
    @OneToMany(() => QrToken, q => q.member) qrTokens: QrToken[];
    @OneToMany(() => Checkin, c => c.member) checkins: Checkin[];
}
