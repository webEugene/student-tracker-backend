import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from './students.model';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student-dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student) private studentRepository: typeof Student,
  ) {}

  async createStudent(dto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(dto);
    return student;
  }

  async deleteStudent(id: string): Promise<void> {
    const deletedStudent = await this.findOne(id);
    await deletedStudent.destroy();
  }

  async updateStudent(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<[number, Student[]]> {
    // const [
    //   numberOfAffectedRows,
    //   [updatedPost],
    // ] = await this.studentRepository.update(
    //   { ...updateStudentDto },
    //   { where: { id }, returning: true },
    // );
    //
    // return updatedPost;
    // const toUpdate = await this.findOne(id);
    // const updated = Object.assign(toUpdate, updateStudentDto);
    const updetedStudent = await this.studentRepository.update(
      { ...updateStudentDto },
      { where: { id }, returning: true },
    );
    return updetedStudent;
  }

  async getAllStudents() {
    const students = this.studentRepository.findAll({ include: { all: true } });
    return students;
  }

  async findOne(id: string): Promise<Student> {
    return this.studentRepository.findOne({
      where: {
        id,
      },
    });
  }
}
