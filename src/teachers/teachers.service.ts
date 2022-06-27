import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Teacher } from './teachers.model';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Group } from '../groups/groups.model';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher) private teacherRepository: typeof Teacher,
  ) {}

  async createTeacher(dto: CreateTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherRepository.create(dto);
    return teacher;
  }

  async deleteTeacher(id: string): Promise<void> {
    const deletedTeacher = await this.findOne(id);
    await deletedTeacher.destroy();
  }

  async findOneTeacher(id: string): Promise<Teacher> {
    const teacher = await this.findOne(id);
    return teacher;
  }
  async findOne(id: string): Promise<Teacher> {
    return this.teacherRepository.findOne({
      where: {
        id,
      },
      include: [Group],
    });
  }

  async updateTeacher(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<[number, Teacher[]]> {
    const updatedTeacher = await this.teacherRepository.update(
      { ...updateTeacherDto },
      { where: { id }, returning: true },
    );
    return updatedTeacher;
  }

  async getAllTeachers() {
    const teachers = await this.teacherRepository.findAll({
      include: { all: true },
    });
    return teachers;
  }

  async uploadTeacherAvatar(
    id: string,
    avatarName,
  ): Promise<[number, Teacher[]]> {
    const createdAvatar = await this.teacherRepository.update(
      { avatar_path: avatarName },
      { where: { id }, returning: true },
    );
    return createdAvatar;
  }
}
