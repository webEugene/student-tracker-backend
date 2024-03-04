import { Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class PaymentsService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    @Inject('PAYMENT_REPOSITORY') private paymentRepository: typeof Payment,
  ) {}
  async createPaymentLiqpay(createLiqpayDto: CreateLiqpayDto) {
    const liqpay: LiqPayLib = new LiqPayLib(
      'sandbox_i42202792679',
      'sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn',
    );
    return liqpay.cnbForm({
      action: 'pay',
      amount: createLiqpayDto.amount,
      currency: 'UAH',
      description: 'test',
      order_id: `${Math.floor(Math.random() * 99999)}`,
      version: '3',
      language: 'uk',
      result_url: 'http://192.168.100.9:8080/',
      server_url:
        'https://f2fe-159-205-118-49.ngrok-free.app/api/v1/payments/server-url',
    });
  }
  async handleServerCallback(signature, data) {
    const liqpay: LiqPayLib = new LiqPayLib(
      'sandbox_i42202792679',
      'sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn',
    );
    const createSignature = liqpay.strToSign(
      `sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn${data}sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn`,
    );
    if (createSignature === signature) {
      console.log(createSignature + ' #### ' + signature);
    } else {
      console.log('no');
    }
  }

  async handleServerUrl(data: any, signature: any) {
    const liqpay: LiqPayLib = new LiqPayLib(
      'sandbox_i42202792679',
      'sandbox_UBJkt3YhKKiM4Jlbkeox4sKB3jSfdJzgdY8XDKqn',
    );
    console.log(data, signature);
    const result = await liqpay.api('request', {
      version: '3',
      action: 'pay',
      order_id: `${Math.floor(Math.random() * 99999)}`,
      data,
      signature,
    });
    console.log(result);
  }
  // async createPaymentFondy(preparePaymentDto: PreparePaymentDto) {
  //   const fondyPassword = 'nl7TGLjzzs4OVs8PI3bAfLSFOEgRutaL';
  //
  //   const orderBody = {
  //     order_id: `${preparePaymentDto.company_id}__${Date.now()}`,
  //     merchant_id: '1529438',
  //     order_desc: `Payment for plan ${Plan[preparePaymentDto.plan]}, by ${
  //       preparePaymentDto.userName
  //     }`,
  //     amount: `${preparePaymentDto.amount}`,
  //     currency: preparePaymentDto.currency,
  //     response_url: 'http://localhost:3000/api/v1/payments/callback',
  //     server_callback_url:
  //       'https://60a7-91-222-42-3.ngrok-free.app/api/v1/payments/server-callback',
  //   };
  //
  //   const orderedKeys = Object.keys(orderBody).sort((a, b) => {
  //     if (a < b) return -1;
  //     if (a > b) return 1;
  //     return 0;
  //   });
  //
  //   const signatureRaw = orderedKeys.map(v => orderBody[v]).join('|');
  //   const signature = createHash('sha1');
  //   const updateSignature = signature.update(
  //     `${fondyPassword}|${signatureRaw}`,
  //   );
  //   const createdSignature = updateSignature.digest('hex');
  //   const { data } = await axios.post(
  //     'https://pay.fondy.eu/api/checkout/url/',
  //     {
  //       request: {
  //         ...orderBody,
  //         signature: createdSignature,
  //       },
  //     },
  //   );
  //   if (data.response.response_status === Response_Status.success) {
  //     const createPaymentData: ICreatePayment = {
  //       plan: preparePaymentDto.plan,
  //       amount: preparePaymentDto.amount,
  //       currency: preparePaymentDto.currency,
  //       company_id: preparePaymentDto.company_id,
  //       payment_status: Payment_Status.created,
  //       payment_id: data.response.payment_id,
  //       signature: createdSignature,
  //     };
  //
  //     await this.createPayment(createPaymentData);
  //
  //     return data.response;
  //   }
  // }
  //
  // async createPayment(createPayment) {
  //   await this.paymentRepository.create(createPayment);
  // }
  // async getTransactionByPaymentIdNumber(payment_id: number) {
  //   return this.paymentRepository.findOne({
  //     where: {
  //       payment_id,
  //     },
  //   });
  // }
  //
  // async handleServerCallback(responseFondy: ResponseFondyPaymentDto) {
  //   try {
  //     console.log(responseFondy);
  //     const transaction = await this.getTransactionByPaymentIdNumber(
  //       responseFondy.payment_id,
  //     );
  //
  //     const updatePayment = {
  //       payment_status: Payment_Status.approved,
  //       payment_time: responseFondy.order_time,
  //     };
  //     return await this.paymentRepository.update(updatePayment, {
  //       where: {
  //         id: transaction.id,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error.code);
  //   }
  // }
}
