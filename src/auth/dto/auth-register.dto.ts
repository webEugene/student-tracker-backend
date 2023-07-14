import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty({ example: 'Ivan', description: 'User name' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Ivanov', description: 'User surname' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsNotEmpty()
  readonly surname: string;

  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  @IsEmail(undefined, { each: true, message: 'email is incorrect' })
  readonly email: string;

  @ApiProperty({ example: 'Corporation', description: 'Company name' })
  @IsNotEmpty()
  readonly company: string;

  @ApiProperty({ example: 'qwerty', description: 'Unique password' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Plan uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly plan_id: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Company uuid',
  })
  @IsUUID()
  @IsOptional()
  readonly company_id: string;
}
