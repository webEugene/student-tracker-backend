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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './students.model';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateStudentDto } from './dto/update-student-dto';
import { ChangeGroupDto } from './dto/change-group.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from '../helpers/avatar-storage';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Creating new user' })
  @ApiResponse({ status: 201, type: Student })
  @ApiCreatedResponse({ type: CreateStudentDto })
  @UseGuards(JwtAuthGuard)
  @Post()
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

  @ApiOperation({ summary: 'Delete student by ID' })
  @ApiResponse({ status: 204, type: [Student] })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteStudent(@Param('id', ParseUUIDPipe) id: string) {
    return await this.studentsService.deleteStudent(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateStudentDto: UpdateStudentDto,
  ) {
    return await this.studentsService.updateStudent(id, updateStudentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/student-group-change/:id')
  async changeStudentGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) ChangeGroupDto: ChangeGroupDto,
  ) {
    return await this.studentsService.changeStudentGroup(id, ChangeGroupDto);
  }

  @ApiOperation({ summary: 'Getting all students' })
  @ApiResponse({ status: 200, type: [Student] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllStudents() {
    return await this.studentsService.getAllStudents();
  }

  @ApiOperation({ summary: 'Getting one student' })
  @ApiResponse({ status: 200, type: [Student] })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneStudent(@Param('id', ParseUUIDPipe) id: string) {
    return await this.studentsService.findOneStudent(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/upload-avatar/:id')
  @UseInterceptors(FileInterceptor('avatar_path', avatarStorage))
  async uploadStudentAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file,
  ) {
    const avatarName = file.originalname.toLowerCase().split(' ').join('-');
    return await this.studentsService.uploadStudentAvatar(id, avatarName);
  }
}
