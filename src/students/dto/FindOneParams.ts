import { IsString, IsUUID } from 'class-validator';

export class FindOneParams {
  @IsString()
  @IsUUID(4)
  id: string;
}
