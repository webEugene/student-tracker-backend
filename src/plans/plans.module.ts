import { forwardRef, Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { AuthModule } from '../auth/auth.module';
import { plansProviders } from './plans.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [PlansController],
  providers: [PlansService, ...plansProviders],
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
})
export class PlansModule {}
