import { Role } from './roles.model';

export const rolesProviders = [
  {
    provide: 'ROLE_REPOSITORY',
    useValue: Role,
  },
];
