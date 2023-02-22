import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCameVisitDto {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'pupil uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly pupil_id: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'came at date and time',
  })
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  readonly came_at: string;

  @ApiProperty({
    example: 2,
    description: 'Who brought',
  })
  @IsNotEmpty()
  readonly brought: number;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
