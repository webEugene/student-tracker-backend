import { forwardRef, Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from '../students/students.model';
import { AuthModule } from '../auth/auth.module';
import { Group } from './group.model';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
  imports: [
    SequelizeModule.forFeature([Group, Student]),
    forwardRef(() => AuthModule),
  ],
})
export class GroupsModule {}
