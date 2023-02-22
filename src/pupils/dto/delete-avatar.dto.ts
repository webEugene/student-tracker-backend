import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteAvatarDto {
  @ApiProperty({ example: 'image.png', description: 'Pupil avatar' })
  @IsNotEmpty()
  @IsString()
  readonly avatar_path: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company id',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
