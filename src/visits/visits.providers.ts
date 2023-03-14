import { Visits } from './visits.model';

export const visitsProviders = [
  {
    provide: 'VISIT_REPOSITORY',
    useValue: Visits,
  },
];
