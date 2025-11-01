import { MemberEntity } from './member.entity';
import { MembershipEntity } from './membership.entity';
import { QrToken } from './qr-token.entity';
import { TenantEntity } from './tenant.entity';
import { UserEntity } from './user.entity';

const entities = [
  UserEntity,
  TenantEntity,
  MemberEntity,
  MembershipEntity,
  QrToken,
];
export { UserEntity, TenantEntity, MemberEntity, MembershipEntity, QrToken };
export default entities;
