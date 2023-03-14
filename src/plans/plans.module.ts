import { forwardRef, Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Plan } from './plans.model';

@Module({
  controllers: [PlansController],
  providers: [PlansService],
  imports: [SequelizeModule.forFeature([Plan]), forwardRef(() => AuthModule)],
})
export class PlansModule {}
