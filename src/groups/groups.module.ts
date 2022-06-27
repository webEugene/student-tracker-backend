import { forwardRef, Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Group } from './groups.model';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
  imports: [SequelizeModule.forFeature([Group]), forwardRef(() => AuthModule)],
})
export class GroupsModule {}
