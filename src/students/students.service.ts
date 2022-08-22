import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from './students.model';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import { ChangeGroupDto } from './dto/change-group.dto';
import { Group } from '../groups/groups.model';
import { Visits } from '../visits/visits.model';
import { Teacher } from '../teachers/teachers.model';
import { Op } from 'sequelize';
import { IdAndCompanyIdDto } from '../common/dto/id-and-company-id.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student) private studentRepository: typeof Student,
  ) {}

  async createStudent(dto: CreateStudentDto): Promise<Student> {
    try {
      return await this.studentRepository.create(dto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          message: ['Student is already exists'],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteStudent(deleteStudentDto: IdAndCompanyIdDto): Promise<void> {
    const deletedStudent = await this.findOne(
      deleteStudentDto.id,
      deleteStudentDto.company_id,
    );
    await deletedStudent.destroy();
  }

  async updateStudent(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<[number, Student[]]> {
    const updatedStudent = await this.studentRepository.update(
      { ...updateStudentDto },
      {
        where: { id, company_id: updateStudentDto.company_id },
        returning: true,
      },
    );
    return updatedStudent;
  }

  async changeStudentGroup(
    id: string,
    changeStudentGroupDto: ChangeGroupDto,
  ): Promise<[number, Student[]]> {
    const changedStudentGroup = await this.studentRepository.update(
      { ...changeStudentGroupDto },
      {
        where: { id, company_id: changeStudentGroupDto.company_id },
        returning: true,
      },
    );
    return changedStudentGroup;
  }

  async getAllStudents(query: GetCompanyIdDto) {
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
      where: {
        company_id: query.company_id,
      },
      order: [['id', 'DESC']],
    });
    return students;
  }

  async findOneStudent(findOneStudentDto: IdAndCompanyIdDto): Promise<Student> {
    const student = await this.findOne(
      findOneStudentDto.id,
      findOneStudentDto.company_id,
    );
    return student;
  }

  async findOne(id: string, company_id: string): Promise<Student> {
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
        company_id,
      },
    });
  }

  async uploadStudentAvatar(
    id: string,
    avatarName,
    company_id,
  ): Promise<[number, Student[]]> {
    const createdAvatar = await this.studentRepository.update(
      { avatar_path: avatarName },
      { where: { id, company_id }, returning: true },
    );
    return createdAvatar;
  }
}
