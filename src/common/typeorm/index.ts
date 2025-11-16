import { EntryEntity } from './entry.entity';
import { MemberEntity } from './member.entity';
import { MembershipEntity } from './membership.entity';
import { PackageEntity } from './package.entity';
import { QrToken } from './qr-token.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';
import { VerificationCode } from './verification-code.entity';

const entities = [
  UserEntity,
  TenantEntity,
  MemberEntity,
  MembershipEntity,
  QrToken,
  EntryEntity,
  PackageEntity,
  VerificationCode,
];
export {
  UserEntity,
  TenantEntity,
  MemberEntity,
  MembershipEntity,
  QrToken,
  EntryEntity,
  PackageEntity,
  VerificationCode,
};
export default entities;
