import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
