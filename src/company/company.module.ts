import { forwardRef, Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { AuthModule } from '../auth/auth.module';
import { ImagesModule } from '../images/images.module';
import { companiesProviders } from './companies.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, ...companiesProviders],
  imports: [DatabaseModule, forwardRef(() => AuthModule), ImagesModule],
  exports: [CompanyService],
})
export class CompanyModule {}
