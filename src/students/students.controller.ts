import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
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

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Creating new user' })
  @ApiResponse({ status: 201, type: Student })
  @ApiCreatedResponse({ type: CreateStudentDto })
  @Post()
  async createStudent(
    @Body(new ValidationPipe()) newStudentDto: CreateStudentDto,
  ): Promise<Student> {
    return this.studentsService.createStudent(newStudentDto);
  }

  @ApiOperation({ summary: 'Delete student by ID' })
  @ApiResponse({ status: 204, type: [Student] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return this.studentsService.deleteStudent(id);
  }

  @Patch(':id')
  updateStudent(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.updateStudent(id, updateStudentDto);
  }

  @ApiOperation({ summary: 'Getting all students' })
  @ApiResponse({ status: 200, type: [Student] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  async getAllStudents() {
    return this.studentsService.getAllStudents();
  }
}
