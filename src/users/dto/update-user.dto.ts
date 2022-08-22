import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Ivan', description: 'User name' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsOptional()
  readonly name: string;

  @ApiProperty({ example: 'Ivanov', description: 'User surname' })
  @IsString({ message: 'Should be string' })
  @Length(2, 20, { message: 'Name should be between 2-20 characters' })
  @IsOptional()
  readonly surname: string;

  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
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
}
