import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly name: string;

  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly surname: string;

  @IsPhoneNumber('UA', { message: 'Phone number should be in Ukraine format' })
  readonly mobilePhone: string;

  @IsISO8601({ strict: true })
  readonly birthday: string;

  @IsOptional()
  readonly avatar_path: string;

  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @IsUUID()
  @IsNotEmpty()
  readonly group_id: string;
}
