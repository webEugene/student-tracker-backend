import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from './students.model';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import { ChangeGroupDto } from './dto/change-group.dto';
import { Group } from '../groups/groups.model';
import { Visits } from '../visits/visits.model';
import { Teacher } from '../teachers/teachers.model';
import { Op } from 'sequelize';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student) private studentRepository: typeof Student,
  ) {}

  async createStudent(dto: CreateStudentDto): Promise<Student> {
    const student = await this.studentRepository.create(dto);
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
    const updatedStudent = await this.studentRepository.update(
      { ...updateStudentDto },
      { where: { id }, returning: true },
    );
    return updatedStudent;
  }

  async changeStudentGroup(
    id: string,
    changeStudentGroupDto: ChangeGroupDto,
  ): Promise<[number, Student[]]> {
    const changedStudentGroup = await this.studentRepository.update(
      { ...changeStudentGroupDto },
      { where: { id }, returning: true },
    );
    return changedStudentGroup;
  }

  async getAllStudents() {
    const date = new Date();
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    const year = date.getFullYear();
    const d = `${year}-${month}-${day}`;

    const students = await this.studentRepository.findAll({
      include: [
        {
          model: Group,
          include: [{ model: Teacher, attributes: ['name', 'surname'] }],
        },
        {
          model: Visits,
          separate: true,
          where: {
            createdAt: {
              [Op.or]: [null, d],
            },
          },
        },
      ],
      order: [['id', 'DESC']],
    });
    return students;
  }

  async findOneStudent(id: string): Promise<Student> {
    const student = await this.findOne(id);
    return student;
  }

  async findOne(id: string): Promise<Student> {
    return this.studentRepository.findOne({
      include: [
        {
          model: Group,
          include: [{ model: Teacher, attributes: ['name', 'surname'] }],
        },
        {
          model: Visits,
          separate: true,
          order: [['createdAt', 'DESC']],
        },
      ],
      where: {
        id,
      },
    });
  }

  async uploadStudentAvatar(
    id: string,
    avatarName,
  ): Promise<[number, Student[]]> {
    const createdAvatar = await this.studentRepository.update(
      { avatar_path: avatarName },
      { where: { id }, returning: true },
    );
    return createdAvatar;
  }
}
