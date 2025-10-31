import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenantEntities';
import { Member } from './memberEntity';

@Entity('checkins')
export class Checkin {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column() tenantId: string;
    @ManyToOne(() => Tenant, t => t.checkins) tenant: Tenant;

    @Column() memberId: string;
    @ManyToOne(() => Member, m => m.checkins) member: Member;

    @Column() method: string;   // "QR" | "MANUAL"
    @Column({ type: 'jsonb', nullable: true }) meta?: any;

    @CreateDateColumn() createdAt: Date;
}
