import { Body, Controller, Post, Res } from '@nestjs/common';
// import { Body, Controller, Post, Redirect, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateLiqpayDto } from './dto/create-liqpay-dto';
// import { PreparePaymentDto } from './dto/prepare-payment.dto';

@Controller('payments')
export class PaymentsController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly paymentService: PaymentsService) {}

  // @Post('/fondy')
  // async createPaymentFondy(@Body() preparePaymentDto: PreparePaymentDto) {
  //   return this.paymentService.createPaymentFondy(preparePaymentDto);
  // }

  // eslint-disable-next-line no-undef
  @Post('/liqpay')
  async createPaymentLiqpay(
    @Body() createLiqpayDto: CreateLiqpayDto,
  ): Promise<string> {
    return this.paymentService.createPaymentLiqpay(createLiqpayDto);
  }

  @Post('/callback-url')
  async handleCallback(@Res() res: any) {
    const { signature, data } = res.req.body;
    await this.paymentService.handleServerCallback(signature, data);
  }

  @Post('/server-url')
  async handleServerCallback(@Res() res: any): Promise<void> {
    const { signature, data } = res.req.body;
    await this.paymentService.handleServerUrl(data, signature);
  }
}
