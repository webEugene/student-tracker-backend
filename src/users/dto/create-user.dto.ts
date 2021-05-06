import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  readonly email: string;
  @ApiProperty({ example: 'qwerty', description: 'Unique password' })
  readonly password: string;
}
