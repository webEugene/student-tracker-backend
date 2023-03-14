import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlansService } from './plans.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { Plan } from './plans.model';

@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly planService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({ status: 200, type: [Plan] })
  async findAll(): Promise<Plan[]> {
    return await this.planService.findAllPlans();
  }
}
