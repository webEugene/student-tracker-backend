import { Body, Controller, Post, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateLiqpayDto } from './dto/create-liqpay-dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('/liqpay')
  async createPaymentLiqpay(
    @Body() createLiqpayDto: CreateLiqpayDto,
  ): Promise<string> {
    return this.paymentService.createPaymentLiqpay(createLiqpayDto);
  }

  @Post('/server-url')
  async handleServerCallback(@Res() res: any): Promise<void> {
    const { signature, data } = res.req.body;
    await this.paymentService.handleServerUrl(data, signature);
  }
}
