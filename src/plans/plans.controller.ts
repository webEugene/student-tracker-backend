import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlansService } from './plans.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Plan } from './plans.model';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly planService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({ status: 200, type: [Plan] })
  async findAll(): Promise<Plan[]> {
    return await this.planService.findAllPlans();
  }

  @Post()
  @ApiOperation({ summary: 'Create plan' })
  @ApiCreatedResponse({
    description: 'Plan is successfully created.',
    type: Plan,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  create(@Body() createPlanDto: CreatePlanDto) {
    this.planService.createPlan(createPlanDto);
  }
}
