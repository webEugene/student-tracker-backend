import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString, Length } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Ivan', description: 'Student name' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  readonly name: string;
  @ApiProperty({ example: 'Ivanov', description: 'Student surname' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  readonly surname: string;
  @ApiProperty({
    example: '380991234567',
    description: "Student's parent phone number",
  })
  readonly phone: string;
  @ApiProperty({ example: 'Group name', description: 'Group name' })
  readonly group: string;
  @ApiProperty({ example: 'image.png', description: 'Student avatar' })
  readonly avatar?: string;
  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Student birthday',
  })
  @IsISO8601({ strict: true })
  readonly birthday: string;
  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Date and time of came at in ISO8601 format',
  })
  @IsISO8601({ strict: true })
  readonly came_at: string;
  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Date and time of leave in ISO8601 format',
  })
  @IsISO8601({ strict: true })
  readonly leave_at: string;
  @ApiProperty({
    example: 'father',
    description: 'Taken by someone',
  })
  @IsString({ message: 'Should be string' })
  readonly taken_away: string;
}
