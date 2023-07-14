import { Inject, Injectable } from '@nestjs/common';
import { Payment } from './payment.model';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('PAYMENT_REPOSITORY') private paymentRepository: typeof Payment,
  ) {}

  async createPayment() {
    return true;
  }
}
