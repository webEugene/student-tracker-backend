import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Teacher } from './teachers.model';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Group } from '../groups/groups.model';
import { IdAndCompanyIdDto } from '../common/dto/id-and-company-id.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher) private teacherRepository: typeof Teacher,
  ) {}

  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    try {
      return await this.teacherRepository.create(createTeacherDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          message: ['Teacher is already exists'],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteTeacher(deleteTeacherDto: IdAndCompanyIdDto): Promise<void> {
    const deletedTeacher = await this.findOne(
      deleteTeacherDto.id,
      deleteTeacherDto.company_id,
    );
    await deletedTeacher.destroy();
  }

  async findOneTeacher(findOneTeacherDto: IdAndCompanyIdDto): Promise<Teacher> {
    const teacher = await this.findOne(
      findOneTeacherDto.id,
      findOneTeacherDto.company_id,
    );
    return teacher;
  }
  async findOne(id: string, company_id: string): Promise<Teacher> {
    return this.teacherRepository.findOne({
      where: {
        id,
        company_id,
      },
      include: [Group],
    });
  }

  async updateTeacher(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<[number, Teacher[]]> {
    const teacher = await this.teacherRepository.update(
      { ...updateTeacherDto },
      {
        where: { id, company_id: updateTeacherDto.company_id },
        returning: true,
      },
    );
    return teacher;
  }

  async getAllTeachers(query: GetCompanyIdDto) {
    const teachers = await this.teacherRepository.findAll({
      include: { all: true },
      where: {
        company_id: query.company_id,
      },
    });
    return teachers;
  }

  async uploadTeacherAvatar(
    id: string,
    avatarName,
    company_id,
  ): Promise<[number, Teacher[]]> {
    const createdAvatar = await this.teacherRepository.update(
      { avatar_path: avatarName },
      { where: { id, company_id }, returning: true },
    );
    return createdAvatar;
  }
}
