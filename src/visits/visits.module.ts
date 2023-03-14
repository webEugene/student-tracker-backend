import { forwardRef, Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { visitsProviders } from './visits.providers';

@Module({
  providers: [VisitsService, ...visitsProviders],
  controllers: [VisitsController],
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  exports: [VisitsService],
})
export class VisitsModule {}
