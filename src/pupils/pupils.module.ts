import { forwardRef, Module } from '@nestjs/common';
import { PupilsService } from './pupils.service';
import { PupilsController } from './pupils.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Pupil } from './pupils.model';
import { ImagesModule } from '../images/images.module';

@Module({
  providers: [PupilsService],
  controllers: [PupilsController],
  exports: [PupilsService],
  imports: [
    SequelizeModule.forFeature([Pupil]),
    forwardRef(() => AuthModule),
    ImagesModule,
  ],
})
export class PupilsModule {}
