import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateVisitDto {
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
  readonly student_id: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  readonly left_at: string;

  @IsNotEmpty()
  readonly took: number;
}
