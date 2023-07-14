import { Plan } from './plans.model';

export const plansProviders = [
  {
    provide: 'PLAN_REPOSITORY',
    useValue: Plan,
  },
];
