import {
  Body,
  Controller,
  Post,
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
  ): Promise<CreateStudentDto> {
    return this.studentsService.createStudent(newStudentDto);
  }
}
