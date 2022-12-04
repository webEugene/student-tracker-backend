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
import { StudentsService } from './students.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Student } from './students.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from '../helpers/avatar-storage';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// Import DTOs
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import { ChangeGroupDto } from './dto/change-group.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { DeleteAvatarDto } from './dto/delete-avatar.dto';

@ApiTags('Students')
@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Student is successfully created.',
    type: Student,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async createStudent(
    @Body(new ValidationPipe()) newStudentDto: CreateStudentDto,
  ): Promise<Student> {
    const student = await this.studentsService.createStudent(newStudentDto);
    if (!student) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Student has not been created due to unknown reason',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return student;
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Change student' })
  @ApiResponse({ status: 200, type: Student })
  async updateStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateStudentDto: UpdateStudentDto,
  ): Promise<[number, Student[]]> {
    return await this.studentsService.updateStudent(id, updateStudentDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete student' })
  @ApiResponse({ status: 204, type: Student })
  async deleteStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<void> {
    return await this.studentsService.deleteStudent({ id, ...query });
  }

  @Patch('/student-group-change/:id')
  @ApiOperation({ summary: 'Change group of student' })
  @ApiResponse({ status: 204, type: Student })
  async changeStudentGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) changeGroupDto: ChangeGroupDto,
  ): Promise<[number, Student[]]> {
    return await this.studentsService.changeStudentGroup(id, changeGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Getting all students' })
  @ApiResponse({ status: 200, type: [Student] })
  async getAllStudents(@Query() query: GetCompanyIdDto): Promise<Student[]> {
    return await this.studentsService.getAllStudents(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Getting one student' })
  @ApiResponse({ status: 200, type: [Student] })
  async findOneStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<Student> {
    return await this.studentsService.findOneStudent({ id, ...query });
  }

  @Patch('/upload-avatar/:id')
  // @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update student avatar' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       avatar_path: { type: 'string' },
  //     },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('avatar_path', avatarStorage))
  async uploadStudentAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file,
    @Query() query: GetCompanyIdDto,
  ): Promise<[number, Student[]]> {
    return await this.studentsService.uploadStudentAvatar(
      id,
      file.filename,
      query.company_id,
    );
  }

  @Delete('/delete-avatar/:id')
  @ApiOperation({ summary: 'Delete student avatar' })
  async deleteStudentAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: DeleteAvatarDto,
  ): Promise<[number, Student[]]> {
    return await this.studentsService.deleteStudentAvatar(
      id,
      query.avatarName,
      query.company_id,
    );
  }
}
