import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { TeachersModule } from '../teachers/teachers.module';
import { GroupsModule } from '../groups/groups.module';
import { PupilsModule } from '../pupils/pupils.module';
import { VisitsModule } from '../visits/visits.module';
import { ImagesModule } from '../images/images.module';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  imports: [
    DatabaseModule,
    RolesModule,
    TeachersModule,
    GroupsModule,
    PupilsModule,
    VisitsModule,
    ImagesModule,
    PaymentsModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
