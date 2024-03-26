import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Payment } from './payment.model';
// import axios from 'axios';
// import { createHash } from 'crypto';
// import { CreatePaymentDto } from './dto/create-payment.dto';
// import Plan from '../common/enums/plan.enum';
// import { ResponseFondyPaymentDto } from './dto/response-fondy.dto';
// import { PreparePaymentDto } from './dto/prepare-payment.dto';
// const LiqPay = require('../common/liqpay/liqpay.js');
import { LiqPayLib } from '../common/liqpay/liqpay-lib';
import { CreateLiqpayDto } from './dto/create-liqpay-dto';
import { v4 as uuidv4 } from 'uuid';
import planEnum from '../common/enums/plan.enum';
// import { ResponsePaymentDto } from './dto/response-payment.dto';
// enum Payment_Status {
//   created = 'CREATED',
//   processing = 'PROCESSING',
//   declined = 'DECLINED',
//   approved = 'APPROVED',
// }
//
// enum Response_Status {
//   success = 'success',
//   failure = 'failure',
// }
//
// interface ICreatePayment {
//   plan: number;
//   amount: string;
//   currency: string;
//   company_id: string;
//   payment_status: string;
//   payment_id: number;
//   signature: string;
// }

interface IPaymentDataSave {
  payment_id: number;
  status: string;
  order_id: string;
  liqpay_order_id: string;
  amount: string;
  currency: string;
  payment_time: string;
  transaction_id: string;
  signature: string;
  plan: number;
  company_id: string;
}

// interface IResponsePayment {
//   payment_id: number;
//   action: string;
//   status: string;
//   version: number;
//   type: string;
//   paytype: string;
//   public_key: string;
//   acq_id: 414963;
//   order_id: string;
//   liqpay_order_id: string;
//   description: string;
//   sender_first_name: string;
//   sender_last_name: string;
//   sender_card_mask2: string;
//   sender_card_bank: string;
//   sender_card_type: string;
//   sender_card_country: 804;
//   ip: string;
//   amount: 200.0;
//   currency: 'UAH';
//   sender_commission: 0.0;
//   receiver_commission: 3.0;
//   agent_commission: 0.0;
//   amount_debit: 200.0;
//   amount_credit: 200.0;
//   commission_debit: 0.0;
//   commission_credit: 3.0;
//   currency_debit: 'UAH';
//   currency_credit: 'UAH';
//   sender_bonus: 0.0;
//   amount_bonus: 0.0;
//   mpi_eci: '7';
//   is_3ds: false;
//   language: 'uk';
//   create_date: 1711061500804;
//   end_date: 1711061500959;
//   transaction_id: 2440399661;
// }

@Injectable()
export class PaymentsService {
  private companyId: string;
  private planType: number;
  constructor(
    // eslint-disable-next-line no-unused-vars
    @Inject('PAYMENT_REPOSITORY') private paymentRepository: typeof Payment,
  ) {}
  async createPaymentLiqpay(createLiqpayDto: CreateLiqpayDto) {
    const liqpay: LiqPayLib = new LiqPayLib(
      'sandbox_i42202792679',
      'sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn',
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
      result_url: 'http://192.168.100.9:8080/',
      server_url:
        'https://07b9-159-205-124-89.ngrok-free.app/api/v1/payments/server-url',
    });
  }
  async handleServerCallback(signature, data) {
    console.log(signature, data);
    //   const liqpay: LiqPayLib = new LiqPayLib(
    //     'sandbox_i42202792679',
    //     'sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn',
    //   );
    //   const createSignature = liqpay.strToSign(
    //     `sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn${data}sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn`,
    //   );
    //   console.log('wewewewe');
    //   if (createSignature === signature) {
    //     console.log(createSignature + ' #### ' + signature);
    //   } else {
    //     console.log('no');
    //   }
  }

  async handleServerUrl(data: any, signature: any) {
    const liqpay: LiqPayLib = new LiqPayLib(
      'sandbox_i42202792679',
      'sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn',
    );
    const createSignature = liqpay.strToSign(
      `sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn${data}sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn`,
    );
    const isValidSignature: boolean = createSignature === signature;
    const decodedDataPayment: Object = liqpay.decodeDataPayment(data);
    let parseDecodedDataPayment: any;

    if (typeof decodedDataPayment === 'string') {
      parseDecodedDataPayment = JSON.parse(decodedDataPayment);
    }

    if (!isValidSignature) {
      throw new Error('Signature is wrong');
    }

    const paymentDataForSave: IPaymentDataSave = {
      payment_id: parseDecodedDataPayment.payment_id,
      status: parseDecodedDataPayment.status,
      order_id: parseDecodedDataPayment.order_id,
      liqpay_order_id: parseDecodedDataPayment.liqpay_order_id,
      amount: parseDecodedDataPayment.amount,
      currency: parseDecodedDataPayment.currency,
      payment_time: parseDecodedDataPayment.end_date,
      transaction_id: parseDecodedDataPayment.transaction_id,
      signature,
      plan: this.planType,
      company_id: this.companyId,
    };
    try {
      console.log(paymentDataForSave);
      await this.paymentRepository.create(paymentDataForSave);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
