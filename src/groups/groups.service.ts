import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './groups.model';
import { Pupil } from '../pupils/pupils.model';
import { Teacher } from '../teachers/teachers.model';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { IdAndCompanyIdDto } from '../common/dto/id-and-company-id.dto';
import planEnum from '../common/enums/plan.enum';
import permissionsGroup from '../common/enums/permissionsGroup.enum';
import exceptionMessages from '../common/enums/exceptionMessages.enum';

@Injectable()
export class GroupsService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    @Inject('GROUP_REPOSITORY') private groupRepository: typeof Group,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const tariff_permission: string =
      planEnum[createGroupDto.tariff_permission];

    const countGroupRows: number = await this.groupRepository.count({
      where: {
        company_id: createGroupDto.company_id,
      },
    });

    if (countGroupRows > permissionsGroup[tariff_permission]) {
      throw new HttpException(
        {
          message: [exceptionMessages.PermissionError],
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const findGroupByName: Group = await this.findGroupByName(
      createGroupDto.name,
      createGroupDto.company_id,
    );

    if (findGroupByName && findGroupByName.name === createGroupDto.name) {
      throw new ConflictException({
        message: [exceptionMessages.DuplicateError],
      });
    }
    return await this.groupRepository.create(createGroupDto);
  }

  async findGroupByName(name: string, company_id: string): Promise<Group> {
    return await this.groupRepository.findOne({
      where: {
        name,
        company_id,
      },
    });
  }

  async findAllGroups(query: GetCompanyIdDto): Promise<Group[]> {
    const groups: Group[] = await this.groupRepository.findAll({
      where: {
        company_id: query.company_id,
      },
      include: [
        { model: Pupil, attributes: ['id', 'name', 'surname'] },
        { model: Teacher, attributes: ['id', 'name', 'surname'] },
      ],
    });

    if (!groups) {
      return [];
    }

    return groups;
  }

  async onlyGroupsFind(query: GetCompanyIdDto): Promise<Group[]> {
    const groups: Group[] = await this.groupRepository.findAll({
      where: {
        company_id: query.company_id,
      },
    });

    if (!groups) {
      return [];
    }

    return groups;
  }

  async findOne(id: string, company_id: string): Promise<Group> {
    const group: Group = await this.groupRepository.findOne({
      where: {
        id,
        company_id,
      },
      include: [{ model: Teacher, attributes: ['id', 'name', 'surname'] }],
    });

    if (!group) {
      throw new NotFoundException({
        message: 'not_f_group',
      });
    }

    return group;
  }

  async update(updateGroupDto: UpdateGroupDto): Promise<[number]> {
    const group: Group = await this.findOne(
      updateGroupDto.id,
      updateGroupDto.company_id,
    );

    return await this.groupRepository.update(updateGroupDto, {
      where: {
        id: group.id,
        company_id: group.company_id,
      },
    });
  }

  async remove(deleteGroupDto: IdAndCompanyIdDto): Promise<void> {
    const group: Group = await this.findOne(
      deleteGroupDto.id,
      deleteGroupDto.company_id,
    );
    try {
      await group.destroy();
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
}
