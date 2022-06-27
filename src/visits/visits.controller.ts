import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { Visits } from './visits.model';
import { CreateCameVisitDto } from './dto/create-came-visit.dto';
import { CreateLeftVisitDto } from './dto/create-left-visit.dto';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post('/came')
  async createCameVisit(
    @Body(new ValidationPipe()) cameAtVisitDto: CreateCameVisitDto,
  ): Promise<Visits> {
    return await this.visitsService.cameAtVisit(cameAtVisitDto);
  }

  @Patch('/left/:id')
  async addLeftAtVisit(
    @Param('id') id: string,
    @Body(new ValidationPipe()) leftAtVisitDto: CreateLeftVisitDto,
  ) {
    return await this.visitsService.addLeftAtVisit(id, leftAtVisitDto);
  }
}
