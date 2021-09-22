import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupDto {
  @IsNotEmpty()
  readonly id: string;
  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
