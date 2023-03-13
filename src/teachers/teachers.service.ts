import {
  ConflictException, Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import path = require('path');
// Sequelize
import { InjectModel } from '@nestjs/sequelize';
// Models
import { Teacher } from './teachers.model';
import { Group } from '../groups/groups.model';
// Services
import { ImagesService } from '../images/images.service';
// DTOs
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { IdAndCompanyIdDto } from '../common/dto/id-and-company-id.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';

@Injectable()
export class TeachersService {
  constructor(
    @Inject('TEACHER_REPOSITORY') private teacherRepository: typeof Teacher,
    private imageService: ImagesService,
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
    return await this.findOne(
      findOneTeacherDto.id,
      findOneTeacherDto.company_id,
    );
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
    return await this.teacherRepository.update(
      { ...updateTeacherDto },
      {
        where: { id, company_id: updateTeacherDto.company_id },
        returning: true,
      },
    );
  }

  async getAllTeachers(query: GetCompanyIdDto) {
    return await this.teacherRepository.findAll({
      include: { all: true },
      where: {
        company_id: query.company_id,
      },
    });
  }

  async uploadTeacherAvatar(
    id: string,
    company_id: string,
    avatar_name: string,
  ): Promise<[number, Teacher[]]> {
    const extension: string = path.parse(avatar_name).ext;
    const updatedAvatarName = `${id}${extension}`;
    const getCurrentAvatarPath = await this.findOne(id, company_id);

    const ifFileExistInFolder = this.imageService.checkForExistence(
      company_id,
      getCurrentAvatarPath.avatar_path,
    );

    if (getCurrentAvatarPath.avatar_path && !ifFileExistInFolder) {
      return await this.teacherRepository.update(
        { avatar_path: updatedAvatarName },
        { where: { id, company_id }, returning: true },
      );
    } else {
      await this.imageService.deleteAvatar(
        company_id,
        getCurrentAvatarPath.avatar_path,
      );
      return await this.teacherRepository.update(
        { avatar_path: updatedAvatarName },
        { where: { id, company_id }, returning: true },
      );
    }
  }

  async deleteTeacherAvatar(
    id: string,
    avatar_path: string,
    company_id: string,
  ): Promise<[number, Teacher[]]> {
    await this.imageService.deleteAvatar(company_id, avatar_path);
    return await this.teacherRepository.update(
      { avatar_path: null },
      { where: { id, company_id }, returning: true },
    );
  }
}
