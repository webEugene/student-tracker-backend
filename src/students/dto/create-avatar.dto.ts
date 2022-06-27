import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateAvatarDto {
  @ApiProperty({ example: 'image.png', description: 'Student avatar' })
  @IsOptional()
  readonly avatar_path: string;
}
