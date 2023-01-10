import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetCompanyIdAvatarDto {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company id',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;

  @ApiProperty({ example: 'image.png', description: 'Student avatar' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly avatar_path: string;
}
