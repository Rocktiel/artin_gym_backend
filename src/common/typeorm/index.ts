import { EntryEntity } from './entry.entity';
import { MemberEntity } from './member.entity';
import { MembershipEntity } from './membership.entity';
import { PackageEntity } from './package.entity';
import { QrToken } from './qr-token.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

const entities = [
  UserEntity,
  TenantEntity,
  MemberEntity,
  MembershipEntity,
  QrToken,
  EntryEntity,
  PackageEntity,
];
export {
  UserEntity,
  TenantEntity,
  MemberEntity,
  MembershipEntity,
  QrToken,
  EntryEntity,
  PackageEntity,
};
export default entities;
