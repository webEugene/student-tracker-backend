import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Company name', description: 'Company name' })
  @IsNotEmpty()
  readonly company: string;
}
