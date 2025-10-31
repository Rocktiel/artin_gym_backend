import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Tenant } from './tenantEntities';
import { Member } from './memberEntity';
import { Package } from './packageEntity';

@Entity('memberships')
@Index(['memberId', 'startAt', 'endAt'])
export class Membership {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column() tenantId: string;
    @ManyToOne(() => Tenant, t => t.memberships) tenant: Tenant;

    @Column() memberId: string;
    @ManyToOne(() => Member, m => m.memberships) member: Member;

    @Column() packageId: string;
    @ManyToOne(() => Package, p => p.memberships) package: Package;

    @Column({ type: 'timestamp with time zone' }) startAt: Date;
    @Column({ type: 'timestamp with time zone' }) endAt: Date;

    @Column({ type: 'int', nullable: true }) remainingSessions?: number;
    @Column({ type: 'jsonb', nullable: true }) allowedHours?: any;

    @CreateDateColumn() createdAt: Date;
}
