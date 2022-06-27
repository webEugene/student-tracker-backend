import { forwardRef, Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Company } from './company.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
  imports: [
    SequelizeModule.forFeature([Company]),
    forwardRef(() => AuthModule),
  ],
})
export class CompanyModule {}
