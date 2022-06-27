import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsISO8601,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Ivan', description: 'Student name' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Ivanov', description: 'Student surname' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly surname: string;

  @ApiProperty({
    example: 'Male',
    description: 'Gender',
  })
  @IsNotEmpty()
  readonly gender: string;

  @ApiProperty({
    example: '380991234567',
    description: "Student's parent phone number",
  })
  @IsPhoneNumber('UA', { message: 'Phone number should be in Ukraine format' })
  readonly mobilePhone: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Student birthday',
  })
  @IsISO8601({ strict: true })
  readonly birthday: string;

  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @IsUUID()
  @IsNotEmpty()
  readonly group_id: string;

  @ApiProperty({
    example: 'email@email.com',
    description: "Student's parent's email",
  })
  @IsOptional()
  @IsEmail()
  readonly email: string;
}
