import { forwardRef, Module } from '@nestjs/common';
import { PupilsService } from './pupils.service';
import { PupilsController } from './pupils.controller';
import { AuthModule } from '../auth/auth.module';
import { ImagesModule } from '../images/images.module';
import { pupilsProviders } from './pupils.providers';
import { DatabaseModule } from '../database/database.module';
import { VisitsModule } from '../visits/visits.module';

@Module({
  providers: [PupilsService, ...pupilsProviders],
  controllers: [PupilsController],
  exports: [PupilsService],
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
    ImagesModule,
    VisitsModule,
  ],
})
export class PupilsModule {}
