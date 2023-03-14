import { forwardRef, Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { groupsProviders } from './groups.providers';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, ...groupsProviders],
  exports: [GroupsService],
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
})
export class GroupsModule {}
