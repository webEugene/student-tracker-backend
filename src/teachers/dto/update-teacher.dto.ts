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

export class UpdateTeacherDto {
  @ApiProperty({ example: 'Ivan', description: 'Student name' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsOptional()
  readonly name: string;

  @ApiProperty({ example: 'Ivanov', description: 'Student surname' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsOptional()
  readonly surname: string;

  @IsPhoneNumber('UA', { message: 'Phone number should be in Ukraine format' })
  @IsOptional()
  readonly mobilePhone: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Student birthday',
  })
  @IsISO8601({ strict: true })
  @IsOptional()
  readonly birthday: string;

  @ApiProperty({ example: 'image.png', description: 'Student avatar' })
  @IsNotEmpty()
  @IsString({ message: 'Should be string' })
  @IsOptional()
  readonly avatar_path: string;

  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  readonly group_id: string;
}
