import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import path = require('path');
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
import planEnum from '../common/enums/plan.enum';
import exceptionMessages from './enum/exceptionMessages.enum';
import permissionsTeacher from '../common/enums/permissionTeacher.enum';

@Injectable()
export class TeachersService {
  constructor(
    @Inject('TEACHER_REPOSITORY') private teacherRepository: typeof Teacher,
    private imageService: ImagesService,
  ) {}

  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const tariff_permission: string =
      planEnum[createTeacherDto.tariff_permission];

    const countTeacherRows: number = await this.teacherRepository.count({
      where: {
        company_id: createTeacherDto.company_id,
      },
    });

    if (countTeacherRows > permissionsTeacher[tariff_permission]) {
      throw new HttpException(
        {
          message: [exceptionMessages.PermissionError],
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const findTeacherByNameAndSurname: Teacher =
      await this.findTeacherByNameAndSurname(
        createTeacherDto.name,
        createTeacherDto.surname,
        createTeacherDto.company_id,
      );

    if (
      findTeacherByNameAndSurname &&
      findTeacherByNameAndSurname.name === createTeacherDto.name &&
      findTeacherByNameAndSurname.surname === createTeacherDto.surname
    ) {
      throw new ConflictException({
        message: [exceptionMessages.DuplicateError],
      });
    }

    return await this.teacherRepository.create(createTeacherDto);
  }

  async findTeacherByNameAndSurname(
    name: string,
    surname: string,
    company_id: string,
  ): Promise<Teacher> {
    return await this.teacherRepository.findOne({
      where: {
        name,
        surname,
        company_id,
      },
    });
  }

  async deleteTeacher(deleteTeacherDto: IdAndCompanyIdDto): Promise<void> {
    const teacher = await this.findOne(
      deleteTeacherDto.id,
      deleteTeacherDto.company_id,
    );
    try {
      await teacher.destroy();
    } catch (error) {
      if (error.parent.code === '23503') {
        throw new ConflictException({
          message: [exceptionMessages.RelationDeleteError],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
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
      this.imageService.deleteAvatar(
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
    this.imageService.deleteAvatar(company_id, avatar_path);
    return await this.teacherRepository.update(
      { avatar_path: null },
      { where: { id, company_id }, returning: true },
    );
  }
}
