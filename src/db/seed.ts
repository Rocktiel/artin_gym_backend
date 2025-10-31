import AppDataSource from './data-source';
import { Tenant } from '../entities/tenantEntities';
import { User } from '../entities/userEntity';
import { Member } from '../entities/memberEntity';
import { Package } from '../entities/packageEntity';
import { Membership } from '../entities/membershipEntity';
import { PackageType, Role } from '../entities/enums';
import * as bcrypt from 'bcrypt';

(async () => {
    const ds = await AppDataSource.initialize();

    const tenant = await ds.getRepository(Tenant).save({ name: 'Artin Gym' });

    const hash = await bcrypt.hash('Admin123!', 10);
    await ds.getRepository(User).save({
        email: 'admin@artin.local', password: hash, role: Role.COMPANY_ADMIN, tenantId: tenant.id,
    });

    const member = await ds.getRepository(Member).save({
        tenantId: tenant.id, fullName: 'Deneme Üye', email: 'member@artin.local',
    });

    const pack = await ds.getRepository(Package).save({
        tenantId: tenant.id, name: 'Aylık', type: PackageType.DURATION, params: { days: 30 }, active: true,
    });

    const now = new Date(); const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    await ds.getRepository(Membership).save({
        tenantId: tenant.id, memberId: member.id, packageId: pack.id, startAt: now, endAt: end,
    });

    console.log('Seed OK'); await ds.destroy();
})().catch(e => { console.error(e); process.exit(1); });
