import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Tenant } from './tenantEntities';
import { PackageType } from './enums';
import { Membership } from './membershipEntity';

@Entity('packages')
export class Package {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column() @Index() tenantId: string;
    @ManyToOne(() => Tenant, t => t.packages) tenant: Tenant;

    @Column() name: string;
    @Column({ type: 'enum', enum: PackageType }) type: PackageType;
    @Column({ type: 'jsonb' }) params: any;
    @Column({ default: true }) active: boolean;

    @CreateDateColumn() createdAt: Date;

    @OneToMany(() => Membership, m => m.package) memberships: Membership[];
}
