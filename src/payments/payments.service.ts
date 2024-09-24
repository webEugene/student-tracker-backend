import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Payment } from './payment.model';
import { LiqPayLib } from '../common/liqpay/liqpay-lib';
import { CreateLiqpayDto } from './dto/create-liqpay-dto';
import { v4 as uuidv4 } from 'uuid';
import planEnum from '../common/enums/plan.enum';
import { CompanyService } from '../company/company.service';
import { ResponsePaymentDto } from './dto/response-payment.dto';

type PreSavePayment = {
  readonly company_id: string;
  readonly plan: number;
  readonly amount: string;
  readonly currency: string;
  readonly status: number;
  readonly order_id: string;
};

interface IPaymentDataSave {
  payment_id: bigint;
  status: number | string;
  order_id: string;
  liqpay_order_id: string;
  amount: string;
  currency: string;
  payment_time: string;
  transaction_id: bigint;
  signature: string;
  plan?: number;
  company_id?: string;
}

type DecodedDataPaymentType = {
  readonly payment_id: bigint;
  readonly status: number;
  readonly order_id: string;
  readonly liqpay_order_id: string;
  readonly amount: string;
  readonly currency: string;
  readonly end_date: string;
  readonly transaction_id: bigint;
  readonly signature: string;
  readonly plan: number;
  readonly company_id: string;
};

// eslint-disable-next-line no-unused-vars
enum PaymentStatusEnum {
  FREE,
  UNPAID,
  PAID,
  WAITING,
}

enum LiqPayStatusEnum {
  success = PaymentStatusEnum.PAID,
  error = PaymentStatusEnum.UNPAID,
  failure = PaymentStatusEnum.UNPAID,
}

@Injectable()
export class PaymentsService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    @Inject('PAYMENT_REPOSITORY') private paymentRepository: typeof Payment,
    // eslint-disable-next-line no-unused-vars
    private companyService: CompanyService,
  ) {}

  async savePayment(paymentSave: PreSavePayment): Promise<void> {
    await this.paymentRepository.create(paymentSave);
  }

  async createPaymentLiqpay(createLiqpayDto: CreateLiqpayDto): Promise<string> {
    const liqpay: LiqPayLib = new LiqPayLib(
      `${process.env.PUBLIC_KEY}`,
      `${process.env.PRIVATE_KEY}`,
    );
    const order_id = uuidv4();
    const form = liqpay.cnbForm({
      action: 'pay',
      amount: createLiqpayDto.amount,
      currency: 'UAH',
      description: `Payment for tariff ${
        planEnum[createLiqpayDto.plan]
      }. Company: ${createLiqpayDto.company_name}`,
      order_id: order_id,
      version: '3',
      language: 'uk',
      result_url: `http://192.168.100.8:8080/homepage`,
      server_url: `https://5e13-77-253-145-23.ngrok-free.app/api/v1/payments/server-url`,
    });

    const paymentDataPreSave: PreSavePayment = {
      company_id: createLiqpayDto.company_id,
      plan: createLiqpayDto.plan,
      amount: createLiqpayDto.amount,
      currency: 'UAH',
      order_id: order_id,
      status: PaymentStatusEnum.WAITING,
    };

    await this.savePayment(paymentDataPreSave);

    return form;
  }

  async handleServerUrl(data: any, signature: any) {
    const liqpay: LiqPayLib = new LiqPayLib(
      `${process.env.PUBLIC_KEY}`,
      `${process.env.PRIVATE_KEY}`,
    );
    const createSignature: string = liqpay.strToSign(
      `${process.env.PRIVATE_KEY}${data}${process.env.PRIVATE_KEY}`,
    );
    const isValidSignature: boolean = createSignature === signature;
    const decodedDataPayment: DecodedDataPaymentType =
      liqpay.decodeDataPayment(data);

    if (!isValidSignature) {
      throw new Error('Signature is wrong');
    }

    const paymentDataForSave: IPaymentDataSave = {
      payment_id: decodedDataPayment.payment_id,
      status: LiqPayStatusEnum[decodedDataPayment.status],
      order_id: decodedDataPayment.order_id,
      liqpay_order_id: decodedDataPayment.liqpay_order_id,
      amount: decodedDataPayment.amount.toString(),
      currency: decodedDataPayment.currency,
      payment_time: decodedDataPayment.end_date.toString(),
      transaction_id: decodedDataPayment.transaction_id,
      signature,
    };

    try {
      await this.update(paymentDataForSave);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async update(paymentDataForSave: ResponsePaymentDto): Promise<void> {
    const payment: Payment = await this.paymentRepository.findOne({
      where: {
        order_id: paymentDataForSave.order_id,
      },
    });

    await this.paymentRepository.update(
      { ...paymentDataForSave },
      {
        where: {
          id: payment.id,
          company_id: payment.company_id,
        },
        returning: true,
      },
    );
    await this.updateCompanyTariff(
      payment.payment_id,
      payment.status,
      payment.company_id,
      payment.createdAt,
    );
  }

  async findPaymentByPaymentId(payment_id: bigint, company_id: string) {
    return await this.paymentRepository.findOne({
      where: {
        payment_id,
        company_id,
      },
    });
  }

  async updateCompanyTariff(
    payment_id: bigint,
    status: number,
    company_id: string,
    createdAt: any,
  ): Promise<void> {
    await this.companyService.updateTariffPlan(
      payment_id,
      status,
      company_id,
      createdAt,
    );
  }

  async findAllPaymentsByCompanyId(company_id: string): Promise<Payment[]> {
    return await this.paymentRepository.findAll({
      where: {
        company_id,
      },
    });
  }
}
