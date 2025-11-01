import { SetMetadata } from '@nestjs/common';
import { UserTypes } from '../enums/UserTypes.enums';

export const Roles = (...roles: UserTypes[]) => SetMetadata('roles', roles);
