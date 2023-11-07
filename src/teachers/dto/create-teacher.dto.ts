import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Tester', description: 'Teacher name' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Tester', description: 'Teacher surname' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly surname: string;

  @ApiProperty({ example: '+380961234567', description: 'Mobile Phone' })
  @IsPhoneNumber('UA', { message: 'Phone number should be in Ukraine format' })
  readonly mobilePhone: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Teacher birthday',
  })
  @IsISO8601({ strict: true })
  readonly birthday: string;

  @ApiProperty({ example: 'image.png', description: 'Teacher avatar' })
  @IsOptional()
  readonly avatar_path: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Group uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly group_id: string;

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
