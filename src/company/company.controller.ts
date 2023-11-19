import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyService } from './company.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Company } from './company.model';
import { ChangeCompanyTariffPlanDto } from './dto/change-tariff.dto';

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

  @Patch('/change-tariff')
  @ApiOperation({ summary: 'Change group of pupil' })
  @ApiResponse({ status: 204, type: Company })
  async changeTariffPlan(
    @Body(new ValidationPipe()) changeTariffPlanDto: ChangeCompanyTariffPlanDto,
  ) {
    return await this.companyService.changeTariffPlan(changeTariffPlanDto);
  }
}
