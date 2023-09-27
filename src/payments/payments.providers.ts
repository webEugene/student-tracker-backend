import { Payment } from './payment.model';

export const paymentsProviders = [
  {
    provide: 'PAYMENT_REPOSITORY',
    useValue: Payment,
  },
];
