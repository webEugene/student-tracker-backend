import { Group } from './groups.model';

export const groupsProviders = [
  {
    provide: 'GROUP_REPOSITORY',
    useValue: Group,
  },
];
