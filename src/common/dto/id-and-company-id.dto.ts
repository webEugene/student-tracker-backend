import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdAndCompanyIdDto {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
