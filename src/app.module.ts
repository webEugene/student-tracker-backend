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
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [
    PupilsController,
    VisitsController,
    TeachersController,
    UsersController,
    CompanyController,
    GroupsController,
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
    CompanyModule,
    ImagesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      // exclude: ['/v1*'],
    }),
  ],
})
export class AppModule {}
