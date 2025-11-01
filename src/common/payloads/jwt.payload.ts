import { UserTypes } from '../enums/UserTypes.enums';

export interface JwtPayload {
  sub: string;
  tenant_id: string;
  role: UserTypes;
}
