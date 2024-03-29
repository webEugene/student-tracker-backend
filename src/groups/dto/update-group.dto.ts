import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Group uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;

  @ApiProperty({ example: 'Montessori', description: 'Group name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
