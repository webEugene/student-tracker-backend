import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { Visits } from './visits.model';
import { CreateCameVisitDto } from './dto/create-came-visit.dto';
import { CreateLeftVisitDto } from './dto/create-left-visit.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteVisitByCompanyDto } from './dto/delete-visit-by-company.dto';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Visits')
@Controller('visits')
@UseGuards(JwtAuthGuard)
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post('/came')
  @ApiCreatedResponse({
    description: 'Came visit is successfully created.',
    type: Visits,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async createCameVisit(
    @Body(new ValidationPipe()) cameAtVisitDto: CreateCameVisitDto,
  ): Promise<Visits> {
    return await this.visitsService.cameAtVisit(cameAtVisitDto);
  }

  @Patch('/left/:id')
  @ApiOperation({ summary: 'Add left at visit' })
  @ApiResponse({ status: 200, type: Visits })
  async addLeftAtVisit(
    @Param('id') id: string,
    @Body(new ValidationPipe()) leftAtVisitDto: CreateLeftVisitDto,
  ): Promise<[number, Visits[]]> {
    return await this.visitsService.addLeftAtVisit(id, leftAtVisitDto);
  }

  @Delete('/delete-all')
  @ApiOperation({ summary: 'Delete' })
  @ApiResponse({ status: 200, type: Visits })
  async deleteAllCompanyVisits(
    @Body(new ValidationPipe())
    deleteAllCompanyVisitsDto: DeleteVisitByCompanyDto,
  ): Promise<void> {
    return await this.visitsService.deleteAllCompanyVisits(
      deleteAllCompanyVisitsDto,
    );
  }

  // @Delete('/delete-pupil-visits')
  // @ApiOperation({ summary: 'Delete' })
  // @ApiResponse({ status: 200, type: Visits })
  // async deletePupilVisits(
  //   @Body(new ValidationPipe()) deleteVisitDto: DeleteVisitByCompanyDto,
  // ): Promise<void> {
  //   return await this.visitsService.deleteAllCompanyVisits(deleteVisitDto);
  // }
}
