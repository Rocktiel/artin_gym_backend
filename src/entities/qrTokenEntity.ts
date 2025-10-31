import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Tenant } from './tenantEntities';
import { Member } from './memberEntity';

@Entity('qr_tokens')
@Index(['memberId', 'expiresAt'])
export class QrToken {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column() tenantId: string;
    @ManyToOne(() => Tenant, t => t.qrTokens) tenant: Tenant;

    @Column() memberId: string;
    @ManyToOne(() => Member, m => m.qrTokens) member: Member;

    @Column({ unique: true }) jti: string;
    @Column({ unique: true }) code: string;

    @Column({ type: 'timestamp with time zone' }) expiresAt: Date;
    @Column({ type: 'timestamp with time zone', nullable: true }) usedAt?: Date;

    @CreateDateColumn() createdAt: Date;
}
