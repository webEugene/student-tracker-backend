import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeftVisitDto {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'visit uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'left at date and time',
  })
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  readonly left_at: string;

  @ApiProperty({
    example: 2,
    description: 'Who took',
  })
  @IsNotEmpty()
  readonly took: number;
}
