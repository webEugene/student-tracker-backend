import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResponsePaymentDto {
  @IsNumber()
  readonly payment_id: number;

  @IsString()
  readonly status: string;

  @IsString()
  readonly order_id: string;

  @IsString()
  readonly liqpay_order_id: string;

  @ApiProperty({
    example: '100',
    description: 'amount of payment',
  })
  @IsString()
  readonly amount: string;

  @ApiProperty({
    example: 'UAH',
    description: 'currency type',
  })
  @IsString()
  readonly currency: string;

  @IsString()
  readonly payment_time: string;

  @IsString()
  readonly transaction_id: string;

  @IsString()
  readonly signature: string;
}
