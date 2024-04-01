import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { paymentsProviders } from './payments.providers';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';

@Module({
  providers: [PaymentsService, ...paymentsProviders],
  controllers: [PaymentsController],
  exports: [PaymentsService],
  imports: [DatabaseModule, forwardRef(() => AuthModule), CompanyModule],
})
export class PaymentsModule {}
