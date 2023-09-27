import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PreparePaymentDto } from './dto/prepare-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('/fondy')
  async createPaymentFondy(@Body() preparePaymentDto: PreparePaymentDto) {
    return this.paymentService.createPaymentFondy(preparePaymentDto);
  }

  @Post('/callback')
  @Redirect(
    'http://localhost:8080/profile/9aae70c0-ec34-4e89-8871-8be612858e18',
  ) // Redirect to success page
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async handleCallback() {
    console.log('handleCallback');
  }

  @Post('/server-callback')
  async handleServerCallback(@Res() res: any): Promise<void> {
    const {
      currency,
      actual_amount,
      order_status,
      order_time,
      order_id,
      payment_id,
      signature,
    } = res.req.body;
    await this.paymentService.handleServerCallback({
      currency,
      actual_amount,
      order_status,
      order_time,
      order_id,
      payment_id,
      signature,
    });
  }
}
