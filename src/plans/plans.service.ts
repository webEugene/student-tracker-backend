import { Inject, Injectable } from '@nestjs/common';
import { Plan } from './plans.model';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(@Inject('PLAN_REPOSITORY') private planRepository: typeof Plan) {}

  async findAllPlans(): Promise<Plan[]> {
    const plans = await this.planRepository.findAll();

    if (!plans) {
      return [];
    }

    return plans;
  }

  async createPlan(createPlanDto: CreatePlanDto): Promise<void> {
    await this.planRepository.create(createPlanDto);
  }
}
