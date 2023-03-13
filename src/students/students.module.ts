import { forwardRef, Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { AuthModule } from '../auth/auth.module';
import { ImagesModule } from '../images/images.module';
import { DatabaseModule } from '../database/database.module';
import { studentsProviders } from './students.providers';

@Module({
  providers: [StudentsService, ...studentsProviders],
  controllers: [StudentsController],
  exports: [StudentsService],
  imports: [DatabaseModule, forwardRef(() => AuthModule), ImagesModule],
})
export class StudentsModule {}
