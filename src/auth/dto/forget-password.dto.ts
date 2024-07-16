import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  @IsEmail(undefined, { each: true, message: 'email is incorrect' })
  readonly email: string;

  @ApiProperty({ example: 'en', description: 'current locale' })
  @IsString()
  @IsNotEmpty()
  readonly locale: string;
}
