import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChangeGroupDto {
  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @IsUUID()
  @IsNotEmpty()
  readonly group_id: string;
}
