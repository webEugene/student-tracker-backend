import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from './teachers.model';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from '../helpers/avatar-storage';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteAvatarDto } from './dto/delete-avatar.dto';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Teachers')
@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private readonly teacherService: TeachersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Teacher is successfully created.',
    type: Teacher,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async createTeacher(
    @Body(new ValidationPipe()) newTeacherDto: CreateTeacherDto,
  ): Promise<Teacher> {
    const teacher = await this.teacherService.createTeacher(newTeacherDto);
    if (!teacher) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Teacher has not been created due to unknown reason',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return teacher;
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Change teacher' })
  @ApiResponse({ status: 200, type: Teacher })
  async updateTeacher(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateTeacherDto: UpdateTeacherDto,
  ): Promise<[number, Teacher[]]> {
    return await this.teacherService.updateTeacher(id, updateTeacherDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete teacher' })
  @ApiResponse({ status: 204, type: Teacher })
  async deleteTeacher(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<void> {
    return await this.teacherService.deleteTeacher({ id, ...query });
  }

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({ status: 200, type: [Teacher] })
  async getAllTeachers(@Query() query: GetCompanyIdDto): Promise<Teacher[]> {
    return await this.teacherService.getAllTeachers(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find one teacher' })
  @ApiResponse({ status: 200, type: Teacher })
  async findOneTeacher(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<Teacher> {
    return await this.teacherService.findOneTeacher({ id, ...query });
  }

  @Patch('/upload-avatar/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update teacher avatar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar_path: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar_path', avatarStorage))
  async uploadTeacherAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file,
    @Query() query: GetCompanyIdDto,
  ): Promise<[number, Teacher[]]> {
    return await this.teacherService.uploadTeacherAvatar(
      id,
      query.company_id,
      file.originalname,
    );
  }

  @Delete('/delete-avatar/:id')
  @ApiOperation({ summary: 'Delete teacher avatar' })
  async deletePupilAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: DeleteAvatarDto,
  ): Promise<[number, Teacher[]]> {
    return await this.teacherService.deleteTeacherAvatar(
      id,
      query.avatar_path,
      query.company_id,
    );
  }
}
