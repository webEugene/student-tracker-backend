import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { StudentsController } from './students/students.controller';
import { StudentsModule } from './students/students.module';
import { GroupsModule } from './groups/groups.module';
import { Student } from './students/students.model';
import { Group } from './groups/groups.model';
import { Visits } from './visits/visits.model';
import { VisitsController } from './visits/visits.controller';
import { VisitsModule } from './visits/visits.module';
import { TeachersController } from './teachers/teachers.controller';
import { TeachersModule } from './teachers/teachers.module';
import { Teacher } from './teachers/teachers.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Company } from './company/company.model';
import { CompanyModule } from './company/company.module';
import { UsersController } from './users/users.controller';
import { CompanyController } from './company/company.controller';
import { GroupsController } from './groups/groups.controller';
import { ImagesModule } from './images/images.module';

@Module({
  controllers: [
    StudentsController,
    VisitsController,
    TeachersController,
    UsersController,
    CompanyController,
    GroupsController,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Student, Group, Visits, Teacher, Company],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    StudentsModule,
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
