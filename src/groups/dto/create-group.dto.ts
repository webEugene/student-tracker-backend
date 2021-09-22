import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @IsNotEmpty()
  readonly name: string;
}
