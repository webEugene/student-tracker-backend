import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import path = require('path');
// Sequelize
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
// Models
import { Student } from './students.model';
import { Group } from '../groups/groups.model';
import { Visits } from '../visits/visits.model';
import { Teacher } from '../teachers/teachers.model';
// Services
import { ImagesService } from '../images/images.service';
// DTOs
import { IdAndCompanyIdDto } from '../common/dto/id-and-company-id.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import { ChangeGroupDto } from './dto/change-group.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student) private studentRepository: typeof Student,
    private imageService: ImagesService,
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
    await this.imageService.deleteAvatar(
      deleteStudentDto.company_id,
      deletedStudent.avatar_path,
    );
    await deletedStudent.destroy();
  }

  async updateStudent(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<[number, Student[]]> {
    return await this.studentRepository.update(
      { ...updateStudentDto },
      {
        where: { id, company_id: updateStudentDto.company_id },
        returning: true,
      },
    );
  }

  async changeStudentGroup(
    id: string,
    changeStudentGroupDto: ChangeGroupDto,
  ): Promise<[number, Student[]]> {
    return await this.studentRepository.update(
      { ...changeStudentGroupDto },
      {
        where: { id, company_id: changeStudentGroupDto.company_id },
        returning: true,
      },
    );
  }

  async getAllStudents(query: GetCompanyIdDto) {
    const date = new Date();
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    const year = date.getFullYear();
    const d = `${year}-${month}-${day}`;

    return await this.studentRepository.findAll({
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
  }

  async findOneStudent(findOneStudentDto: IdAndCompanyIdDto): Promise<Student> {
    return await this.findOne(
      findOneStudentDto.id,
      findOneStudentDto.company_id,
    );
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
    company_id: string,
    avatar_name: string,
  ): Promise<[number, Student[]]> {
    const extension: string = path.parse(avatar_name).ext;
    const updatedAvatarName = `${id}${extension}`;

    const getCurrentAvatarPath = await this.findOne(id, company_id);
    const ifFileExistInFolder = this.imageService.checkForExistence(
      company_id,
      getCurrentAvatarPath.avatar_path,
    );
    if (getCurrentAvatarPath.avatar_path && !ifFileExistInFolder) {
      return await this.studentRepository.update(
        { avatar_path: updatedAvatarName },
        { where: { id, company_id }, returning: true },
      );
    } else {
      await this.imageService.deleteAvatar(
        company_id,
        getCurrentAvatarPath.avatar_path,
      );

      return await this.studentRepository.update(
        { avatar_path: updatedAvatarName },
        { where: { id, company_id }, returning: true },
      );
    }
  }

  async deleteStudentAvatar(
    id: string,
    avatar_path: string,
    company_id: string,
  ): Promise<[number, Student[]]> {
    await this.imageService.deleteAvatar(company_id, avatar_path);
    return await this.studentRepository.update(
      { avatar_path: null },
      { where: { id, company_id }, returning: true },
    );
  }
}
