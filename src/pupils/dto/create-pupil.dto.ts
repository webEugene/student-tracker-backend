import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreatePupilDto {
  @ApiProperty({ example: 'Ivan', description: 'Pupil name' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Ivanov', description: 'Pupil surname' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly surname: string;

  @ApiProperty({
    example: 'Male',
    description: 'Pupil gender',
  })
  @IsNotEmpty()
  readonly gender: string;

  @ApiProperty({
    example: '+380991234567',
    description: "Pupil's parent phone number",
  })
  @IsPhoneNumber('UA', { message: 'Phone number should be in Ukraine format' })
  readonly mobilePhone: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Pupil birthday',
  })
  @IsISO8601({ strict: true })
  readonly birthday: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Group uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly group_id: string;

  @ApiProperty({
    example: 'email@email.com',
    description: "Pupil's parent's email",
  })
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly company_id: string;

  @ApiProperty({
    example: 0,
    description: 'Tariff permission',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly tariff_permission: number;
}
