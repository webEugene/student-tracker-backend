import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { paymentsProviders } from './payments.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [PaymentsService, ...paymentsProviders],
  controllers: [PaymentsController],
  imports: [DatabaseModule],
})
export class PaymentsModule {}
