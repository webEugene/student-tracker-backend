import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Company name', description: 'Company name' })
  @IsNotEmpty()
  readonly company: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Plan uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly plan_id: string;
}
