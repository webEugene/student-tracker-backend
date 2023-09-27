import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    // example: 'Premium',
    example: 0,
    description: 'Name of the plan',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly plan: number;

  @ApiProperty({
    example: '10000',
    description: 'amount of payment',
  })
  @IsString()
  readonly amount: string;

  @ApiProperty({
    example: 'UAH',
    description: 'Type of the currency',
  })
  @IsString()
  @IsNotEmpty()
  readonly currency: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;

  @IsString()
  @IsNotEmpty()
  readonly payment_status: string;

  @IsNumber()
  @IsNotEmpty()
  readonly payment_id: number;

  @IsString()
  @IsNotEmpty()
  readonly signature: string;
}
