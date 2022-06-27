import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from './teachers.model';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from '../helpers/avatar-storage';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teacherService: TeachersService) {}

  @Post()
  async createTeacher(
    @Body(new ValidationPipe()) newTeacherDto: CreateTeacherDto,
  ): Promise<Teacher> {
    return await this.teacherService.createTeacher(newTeacherDto);
  }

  @Delete(':id')
  async deleteTeacher(@Param('id', ParseUUIDPipe) id: string) {
    return await this.teacherService.deleteTeacher(id);
  }

  @Patch(':id')
  async updateTeacher(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateTeacherDto: UpdateTeacherDto,
  ) {
    return await this.teacherService.updateTeacher(id, updateTeacherDto);
  }

  @Get()
  async getAllTeachers() {
    return await this.teacherService.getAllTeachers();
  }

  @Get(':id')
  async findOneTeacher(@Param('id', ParseUUIDPipe) id: string) {
    return await this.teacherService.findOneTeacher(id);
  }

  @Patch('/upload-avatar/:id')
  @UseInterceptors(FileInterceptor('avatar_path', avatarStorage))
  async uploadTeacherAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file,
  ) {
    const avatarName = file.originalname.toLowerCase().split(' ').join('-');
    return await this.teacherService.uploadTeacherAvatar(id, avatarName);
  }
}
