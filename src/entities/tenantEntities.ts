import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './userEntity';
import { Member } from './memberEntity';
import { Package } from './packageEntity';
import { Membership } from './membershipEntity';
import { QrToken } from './qrTokenEntity';
import { Checkin } from './checkinEntity';

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column() name: string;
    @CreateDateColumn() createdAt: Date;

    @OneToMany(() => User, u => u.tenant) users: User[];
    @OneToMany(() => Member, m => m.tenant) members: Member[];
    @OneToMany(() => Package, p => p.tenant) packages: Package[];
    @OneToMany(() => Membership, m => m.tenant) memberships: Membership[];
    @OneToMany(() => QrToken, q => q.tenant) qrTokens: QrToken[];
    @OneToMany(() => Checkin, c => c.tenant) checkins: Checkin[];
}
