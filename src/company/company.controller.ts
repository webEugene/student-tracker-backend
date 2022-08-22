import { Body, Controller, Post } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyService } from './company.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Company } from './company.model';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Company is successfully created.',
    type: Company,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.create(createCompanyDto);
  }
}
