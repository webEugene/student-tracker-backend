import { Company } from './company.model';

export const companiesProviders = [
  {
    provide: 'COMPANY_REPOSITORY',
    useValue: Company,
  },
];
