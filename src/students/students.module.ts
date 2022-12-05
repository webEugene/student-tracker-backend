import { forwardRef, Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Student } from './students.model';
import { ImagesModule } from '../images/images.module';

@Module({
  providers: [StudentsService],
  controllers: [StudentsController],
  exports: [StudentsService],
  imports: [
    SequelizeModule.forFeature([Student]),
    forwardRef(() => AuthModule),
    ImagesModule,
  ],
})
export class StudentsModule {}
