import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVisitDto {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Visit uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  readonly came_at: string;

  @IsNotEmpty()
  readonly brought: number;

  @IsUUID()
  @IsNotEmpty()
  readonly pupil_id: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  readonly left_at: string;

  @IsNotEmpty()
  readonly took: number;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
