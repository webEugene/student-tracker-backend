import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
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
  private logger: Logger = new Logger('GroupsService');

  constructor(
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
      // LOGGING PERMISSION ERROR
      this.logger.log({
        level: 'error',
        message: 'Failed to create group due to Permission Error.',
        error: {
          status: HttpStatus.FORBIDDEN,
        },
      });
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
      // LOGGING DUPLICATION ERROR
      this.logger.log({
        level: 'error',
        message: 'Failed to create group due to Duplicate Error.',
      });
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
      // LOGGING NOT FOUND WARN
      this.logger.log({
        level: 'warn',
        message: 'Group is Not Found.',
        error: {
          status: HttpStatus.NOT_FOUND,
        },
      });
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
        this.logger.log({
          level: 'error',
          message: 'Group ca not be deleted due to Relation Delete Error.',
          error: {
            status: HttpStatus.CONFLICT,
            code: error.parent.code,
          },
        });
        throw new ConflictException({
          message: [exceptionMessages.RelationDeleteError],
        });
      } else {
        this.logger.log({
          level: 'error',
          message: 'Group can not be deleted due to Server Error.',
          error: {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            code: error?.parent?.code,
          },
        });
        throw new InternalServerErrorException();
      }
    }
  }
}
