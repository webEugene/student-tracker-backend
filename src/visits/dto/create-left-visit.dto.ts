import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLeftVisitDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  readonly left_at: string;

  @IsNotEmpty()
  readonly took: number;
}
