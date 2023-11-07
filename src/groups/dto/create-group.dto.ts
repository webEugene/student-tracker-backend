import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Montessori', description: 'Group name' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;

  @ApiProperty({
    example: 0,
    description: 'Tariff permission',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly tariff_permission: number;
}
