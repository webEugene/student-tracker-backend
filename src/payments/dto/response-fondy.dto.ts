import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResponseFondyPaymentDto {
  @ApiProperty({
    example: 'UAH',
    description: 'currency type',
  })
  @IsString()
  readonly currency: string;

  @ApiProperty({
    example: '100',
    description: 'amount of payment',
  })
  @IsString()
  readonly actual_amount: string;

  @IsString()
  readonly order_status: string;

  @IsString()
  readonly order_time: string;

  @IsString()
  readonly order_id: string;

  @IsNumber()
  readonly payment_id: number;

  @IsString()
  readonly signature: string;
}
