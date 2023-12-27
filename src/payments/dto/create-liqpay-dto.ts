import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLiqpayDto {
  // @ApiProperty({
  //   // example: 'Premium',
  //   example: 0,
  //   description: 'Name of the plan',
  // })
  // @IsNumber()
  // @IsNotEmpty()
  // readonly plan: number;

  @IsString()
  @IsNotEmpty()
  amount: string;

  // @IsString()
  // @IsNotEmpty()
  // currency: string;
  //
  // @IsString()
  // @IsNotEmpty()
  // description: string;

  // @IsString()
  // @IsNotEmpty()
  // order_id: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
