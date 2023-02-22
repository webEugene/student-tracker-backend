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
import { Pupil } from './pupils.model';
import { Group } from '../groups/groups.model';
import { Visits } from '../visits/visits.model';
import { Teacher } from '../teachers/teachers.model';
// Services
import { ImagesService } from '../images/images.service';
// DTOs
import { IdAndCompanyIdDto } from '../common/dto/id-and-company-id.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { CreatePupilDto } from './dto/create-pupil.dto';
import { UpdatePupilDto } from './dto/update-pupil-dto';
import { ChangeGroupDto } from './dto/change-group.dto';

@Injectable()
export class PupilsService {
  constructor(
    @InjectModel(Pupil) private pupilRepository: typeof Pupil,
    private imageService: ImagesService,
  ) {}

  async createPupil(dto: CreatePupilDto): Promise<Pupil> {
    try {
      return await this.pupilRepository.create(dto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          message: ['Pupil is already exists'],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deletePupil(deletePupilDto: IdAndCompanyIdDto): Promise<void> {
    const deletedPupil = await this.findOne(
      deletePupilDto.id,
      deletePupilDto.company_id,
    );
    await this.imageService.deleteAvatar(
      deletePupilDto.company_id,
      deletedPupil.avatar_path,
    );
    await deletedPupil.destroy();
  }

  async updatePupil(
    id: string,
    updatePupilDto: UpdatePupilDto,
  ): Promise<[number, Pupil[]]> {
    return await this.pupilRepository.update(
      { ...updatePupilDto },
      {
        where: { id, company_id: updatePupilDto.company_id },
        returning: true,
      },
    );
  }

  async changePupilGroup(
    id: string,
    changePupilGroupDto: ChangeGroupDto,
  ): Promise<[number, Pupil[]]> {
    return await this.pupilRepository.update(
      { ...changePupilGroupDto },
      {
        where: { id, company_id: changePupilGroupDto.company_id },
        returning: true,
      },
    );
  }

  async getAllPupils(query: GetCompanyIdDto) {
    const date = new Date();
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    const year = date.getFullYear();
    const d = `${year}-${month}-${day}`;

    return await this.pupilRepository.findAll({
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

  async findOnePupil(findOnePupilDto: IdAndCompanyIdDto): Promise<Pupil> {
    return await this.findOne(findOnePupilDto.id, findOnePupilDto.company_id);
  }

  async findOne(id: string, company_id: string): Promise<Pupil> {
    return this.pupilRepository.findOne({
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

  async uploadPupilAvatar(
    id: string,
    company_id: string,
    avatar_name: string,
  ): Promise<[number, Pupil[]]> {
    const extension: string = path.parse(avatar_name).ext;
    const updatedAvatarName = `${id}${extension}`;

    const getCurrentAvatarPath = await this.findOne(id, company_id);
    const ifFileExistInFolder = this.imageService.checkForExistence(
      company_id,
      getCurrentAvatarPath.avatar_path,
    );
    if (getCurrentAvatarPath.avatar_path && !ifFileExistInFolder) {
      return await this.pupilRepository.update(
        { avatar_path: updatedAvatarName },
        { where: { id, company_id }, returning: true },
      );
    } else {
      await this.imageService.deleteAvatar(
        company_id,
        getCurrentAvatarPath.avatar_path,
      );

      return await this.pupilRepository.update(
        { avatar_path: updatedAvatarName },
        { where: { id, company_id }, returning: true },
      );
    }
  }

  async deletePupilAvatar(
    id: string,
    avatar_path: string,
    company_id: string,
  ): Promise<[number, Pupil[]]> {
    await this.imageService.deleteAvatar(company_id, avatar_path);
    return await this.pupilRepository.update(
      { avatar_path: null },
      { where: { id, company_id }, returning: true },
    );
  }
}
