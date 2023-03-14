import { Injectable } from '@nestjs/common';
import { Plan } from './plans.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PlansService {
  constructor(@InjectModel(Plan) private planRepository: typeof Plan) {}

  async findAllPlans(): Promise<Plan[]> {
    const plans = await this.planRepository.findAll();

    if (!plans) {
      return [];
    }

    return plans;
  }
}
