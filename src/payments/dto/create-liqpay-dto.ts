import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateLiqpayDto {
  @ApiProperty({
    // example: 'Premium',
    example: 0,
    description: 'Name of the plan in number',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly plan: number;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    example: 'Company name international',
    description: 'Company name',
  })
  @IsString()
  @IsNotEmpty()
  readonly company_name: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
