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

interface IPaymentDataSave {
  payment_id: bigint;
  status: string;
  order_id: string;
  liqpay_order_id: string;
  amount: string;
  currency: string;
  payment_time: string;
  transaction_id: bigint;
  signature: string;
  plan: number;
  company_id: string;
}

type DecodedDataPaymentType = {
  readonly payment_id: bigint;
  readonly status: string;
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

@Injectable()
export class PaymentsService {
  private companyId: string;
  private planType: number;
  constructor(
    // eslint-disable-next-line no-unused-vars
    @Inject('PAYMENT_REPOSITORY') private paymentRepository: typeof Payment,
    // eslint-disable-next-line no-unused-vars
    private companyService: CompanyService,
  ) {}

  async createPaymentLiqpay(createLiqpayDto: CreateLiqpayDto): Promise<string> {
    const liqpay: LiqPayLib = new LiqPayLib(
      `${process.env.PUBLIC_KEY}`,
      `${process.env.PRIVATE_KEY}`,
    );

    this.companyId = createLiqpayDto.company_id;
    this.planType = createLiqpayDto.plan;

    return liqpay.cnbForm({
      action: 'pay',
      amount: createLiqpayDto.amount,
      currency: 'UAH',
      description: `Payment for tariff ${
        planEnum[createLiqpayDto.plan]
      }. Company: ${createLiqpayDto.company_name}`,
      order_id: uuidv4(),
      version: '3',
      language: 'uk',
      result_url: `http://192.168.100.9:8080/`,
      server_url: `${process.env.LIQPAY_SERVER_URL}/api/v1/payments/server-url`,
    });
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
    const rr = liqpay.api('request', {
      action: 'status',
      version: '3',
      order_id: decodedDataPayment.order_id,
    });

    console.log(decodedDataPayment, rr);

    console.log(decodedDataPayment);
    // const paymentDataForSave: IPaymentDataSave = {
    //   payment_id: decodedDataPayment.payment_id,
    //   status: decodedDataPayment.status,
    //   order_id: decodedDataPayment.order_id,
    //   liqpay_order_id: decodedDataPayment.liqpay_order_id,
    //   amount: decodedDataPayment.amount.toString(),
    //   currency: decodedDataPayment.currency,
    //   payment_time: decodedDataPayment.end_date.toString(),
    //   transaction_id: decodedDataPayment.transaction_id,
    //   signature,
    //   plan: this.planType,
    //   company_id: this.companyId,
    // };
    // console.log(paymentDataForSave);
    // try {
    //   await this.paymentRepository.create(paymentDataForSave);
    //   await this.updateCompanyTariff(
    //     paymentDataForSave.payment_id,
    //     this.companyId,
    //   );
    // } catch (e) {
    //   throw new InternalServerErrorException();
    // }
  }

  async findPaymentByPaymentId(payment_id: bigint, company_id: string) {
    return await this.paymentRepository.findOne({
      where: {
        payment_id,
        company_id,
      },
    });
  }

  async updateCompanyTariff(payment_id: bigint, company_id: string) {
    const getPayment: Payment = await this.findPaymentByPaymentId(
      payment_id,
      company_id,
    );

    if (getPayment) {
      await this.companyService.updateTariffPlan(
        getPayment.payment_id,
        getPayment.company_id,
        getPayment.createdAt,
      );
    }
  }

  async findAllPaymentsByCompanyId(company_id: string): Promise<Payment[]> {
    return await this.paymentRepository.findAll({
      where: {
        company_id,
      },
    });
  }
}
