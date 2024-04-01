import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { PupilsController } from './pupils/pupils.controller';
import { PupilsModule } from './pupils/pupils.module';
import { GroupsModule } from './groups/groups.module';
import { VisitsController } from './visits/visits.controller';
import { VisitsModule } from './visits/visits.module';
import { TeachersController } from './teachers/teachers.controller';
import { TeachersModule } from './teachers/teachers.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CompanyModule } from './company/company.module';
import { UsersController } from './users/users.controller';
import { CompanyController } from './company/company.controller';
import { GroupsController } from './groups/groups.controller';
import { ImagesModule } from './images/images.module';
import { PaymentsModule } from './payments/payments.module';
import { PlansModule } from './plans/plans.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { PaymentsController } from './payments/payments.controller';

@Module({
  controllers: [
    PupilsController,
    VisitsController,
    TeachersController,
    UsersController,
    CompanyController,
    GroupsController,
    PaymentsController,
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    RolesModule,
    AuthModule,
    PupilsModule,
    GroupsModule,
    VisitsModule,
    TeachersModule,
    ImagesModule,
    PaymentsModule,
    CompanyModule,
    PlansModule,
    MailerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      // exclude: ['/v1*'],
    }),
  ],
})
export class AppModule {}
