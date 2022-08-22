import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetCompanyIdDto {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company id',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
