import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Tenant } from './tenantEntities';
import { Role } from './enums';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column() @Index() tenantId: string;
    @ManyToOne(() => Tenant, t => t.users) tenant: Tenant;

    @Column({ unique: true }) email: string;
    @Column() password: string;
    @Column({ type: 'enum', enum: Role }) role: Role;

    @CreateDateColumn() createdAt: Date;
}
