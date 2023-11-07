import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    // example: 'Premium',
    example: 0,
    description: 'Name of the plan',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly plan: number;

  @ApiProperty({ example: 'Lorem', description: 'Description plan' })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ example: '200.00', description: 'Price for plan' })
  @IsString()
  readonly price: string;

  @ApiProperty({
    example: 'UAH',
    description: 'Type of the currency',
  })
  @IsString()
  @IsNotEmpty()
  readonly currency_code: string;

  @ApiProperty({ example: 'UA', description: 'Country code' })
  @IsString()
  @IsNotEmpty()
  readonly country_code: string;
}
