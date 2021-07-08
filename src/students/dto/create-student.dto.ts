import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, Length } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Ivan', description: 'Student name' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  readonly name: string;
  @ApiProperty({ example: 'Ivanov', description: 'Student surname' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  readonly surname: string;
  @ApiProperty({ example: 'image.png', description: 'Student avatar' })
  readonly avatar: string;
  @ApiProperty({ example: '12/12/2017', description: 'Student birthday' })
  readonly birthday: string;
  @ApiProperty({
    example: '12/12/2017-10:22',
    description: 'Date and time of come',
  })
  @IsDate({ message: 'Should be date' })
  readonly came_at: string;
  @ApiProperty({
    example: '12/12/2017-14:22',
    description: 'Date and time of leave',
  })
  @IsDate({ message: 'Should be date' })
  readonly leave_at: string;
  @ApiProperty({
    example: 'father',
    description: 'Taken by someone',
  })
  @IsString({ message: 'Should be string' })
  readonly taken_away: string;
}
