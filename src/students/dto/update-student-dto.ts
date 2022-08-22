import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class UpdateStudentDto {
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

  @ApiProperty({ example: 'image.png', description: 'Student avatar' })
  @ApiProperty({
    example: 'Male',
    description: 'Gender',
  })
  @IsNotEmpty()
  @IsOptional()
  readonly gender: string;

  @ApiProperty({
    example: '+380991234567',
    description: "Student's parent phone number",
  })
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

  @ApiProperty({
    example: 'email@email.com',
    description: "Student's parent's email",
  })
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Group uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  readonly group_id: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;
}
