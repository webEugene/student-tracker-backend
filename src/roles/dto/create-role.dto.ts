import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'user', description: 'Role as a user' })
  readonly value: string;

  @ApiProperty({
    example: 'Manage not all',
    description: 'Description what user can manage',
  })
  readonly description: string;
}
