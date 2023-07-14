import { Inject, Injectable } from '@nestjs/common';
import { Plan } from './plans.model';

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
}
