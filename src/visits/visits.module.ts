import { forwardRef, Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Visits } from './visits.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [VisitsService],
  controllers: [VisitsController],
  imports: [SequelizeModule.forFeature([Visits]), forwardRef(() => AuthModule)],
  exports: [VisitsService],
})
export class VisitsModule {}
