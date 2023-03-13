import { forwardRef, Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { AuthModule } from '../auth/auth.module';
import { ImagesModule } from '../images/images.module';
import { teachersProviders } from './teachers.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [TeachersService, ...teachersProviders],
  controllers: [TeachersController],
  exports: [TeachersService],
  imports: [DatabaseModule, forwardRef(() => AuthModule), ImagesModule],
})
export class TeachersModule {}
