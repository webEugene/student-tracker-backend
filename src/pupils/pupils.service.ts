import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// Sequelize
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
import { DeletePupilVisitDto } from '../visits/dto/delete-pupil-visit.dto';
import exceptionMessages from '../common/enums/exceptionMessages.enum';
import permissionsPupil from '../common/enums/permissionPupil.enum';
import planEnum from '../common/enums/plan.enum';
import { Company } from '../company/company.model';
import path = require('path');
import { VisitsService } from '../visits/visits.service';

@Injectable()
export class PupilsService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    @Inject('PUPIL_REPOSITORY') private pupilRepository: typeof Pupil,
    // eslint-disable-next-line no-unused-vars
    private imageService: ImagesService,
    private visitsService: VisitsService,
  ) {}

  async createPupil(createPupilDto: CreatePupilDto): Promise<Pupil> {
    const tariff_permission: string =
      planEnum[createPupilDto.tariff_permission];

    const countPupilRows: number = await this.pupilRepository.count({
      where: {
        company_id: createPupilDto.company_id,
      },
    });

    if (countPupilRows > permissionsPupil[tariff_permission]) {
      throw new HttpException(
        {
          message: [exceptionMessages.PermissionError],
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const findPupilByNameAndSurname: Pupil =
      await this.findPupilByNameAndSurname(
        createPupilDto.name,
        createPupilDto.surname,
        createPupilDto.company_id,
      );
    if (
      findPupilByNameAndSurname &&
      findPupilByNameAndSurname.name === createPupilDto.name &&
      findPupilByNameAndSurname.surname === createPupilDto.surname
    ) {
      throw new ConflictException({
        message: [exceptionMessages.DuplicateError],
      });
    }

    return await this.pupilRepository.create(createPupilDto);
  }

  async deletePupil(deletePupilDto: IdAndCompanyIdDto): Promise<void> {
    const deletedPupil: Pupil = await this.findOne(
      deletePupilDto.id,
      deletePupilDto.company_id,
    );

    try {
      this.imageService.deleteAvatar(
        deletePupilDto.company_id,
        deletedPupil.avatar_path,
      );

      await this.visitsService.deletePupilVisits({
        pupil_id: deletedPupil.id,
        company_id: deletePupilDto.company_id,
      });

      await deletedPupil.destroy();
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

  async getAllPupils(query: GetCompanyIdDto): Promise<Pupil[]> {
    const date: Date = new Date();
    const day: string = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const month: string =
      (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    const year: number = date.getFullYear();
    const d: string = `${year}-${month}-${day}`;

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

  async findPupilByNameAndSurname(
    name: string,
    surname: string,
    company_id: string,
  ): Promise<Pupil> {
    return await this.pupilRepository.findOne({
      where: {
        name,
        surname,
        company_id,
      },
    });
  }

  async findOnePupil(findOnePupilDto: IdAndCompanyIdDto): Promise<Pupil> {
    return await this.findOne(findOnePupilDto.id, findOnePupilDto.company_id);
  }

  async findOne(id: string, company_id: string): Promise<Pupil> {
    const pupil: Promise<Pupil> = this.pupilRepository.findOne({
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
        {
          model: Company,
          attributes: ['tariff_permission'],
        },
      ],
      where: {
        id,
        company_id,
      },
    });

    if (!pupil) {
      throw new NotFoundException({
        message: 'not_f_pupil',
      });
    }

    return pupil;
  }

  async uploadPupilAvatar(
    id: string,
    company_id: string,
    avatar_name: string,
  ): Promise<[number, Pupil[]]> {
    const extension: string = path.parse(avatar_name).ext;
    const updatedAvatarName: string = `${id}${extension}`;

    const getCurrentAvatarPath: Pupil = await this.findOne(id, company_id);
    const ifFileExistInFolder: boolean = this.imageService.checkForExistence(
      company_id,
      getCurrentAvatarPath.avatar_path,
    );
    if (getCurrentAvatarPath.avatar_path && !ifFileExistInFolder) {
      return await this.pupilRepository.update(
        { avatar_path: updatedAvatarName },
        { where: { id, company_id }, returning: true },
      );
    } else {
      this.imageService.deleteAvatar(
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
    this.imageService.deleteAvatar(company_id, avatar_path);

    return await this.pupilRepository.update(
      { avatar_path: null },
      { where: { id, company_id }, returning: true },
    );
  }
}
