import { forwardRef, Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Teacher } from './teachers.model';

@Module({
  providers: [TeachersService],
  controllers: [TeachersController],
  exports: [TeachersService],
  imports: [
    SequelizeModule.forFeature([Teacher]),
    forwardRef(() => AuthModule),
  ],
})
export class TeachersModule {}
