import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class ChangeCompanyTariffPlanDto {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Plan uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly plan_id: string;

  @ApiProperty({
    example: '0',
    description: 'Plan as number',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly plan: number;
}
