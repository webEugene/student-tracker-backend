import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Username', description: 'Username' })
  @IsNotEmpty()
  readonly username: string;
  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  @IsEmail(undefined, { each: true, message: 'email is incorrect' })
  readonly email: string;
  @ApiProperty({ example: 'qwerty', description: 'Unique password' })
  @IsNotEmpty()
  readonly password: string;
}
