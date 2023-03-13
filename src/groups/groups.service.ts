import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './groups.model';
import { Student } from '../students/students.model';
import { Teacher } from '../teachers/teachers.model';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { IdAndCompanyIdDto } from '../common/dto/id-and-company-id.dto';

@Injectable()
export class GroupsService {
  constructor(
    @Inject('GROUP_REPOSITORY') private groupRepository: typeof Group,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    try {
      return await this.groupRepository.create(createGroupDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          message: ['Group is already exists'],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAllGroups(query: GetCompanyIdDto): Promise<Group[]> {
    const groups = await this.groupRepository.findAll({
      where: {
        company_id: query.company_id,
      },
      include: [
        { model: Student, attributes: ['id', 'name', 'surname'] },
        { model: Teacher, attributes: ['id', 'name', 'surname'] },
      ],
    });

    if (!groups) {
      return [];
    }

    return groups;
  }

  async onlyGroupsFind(query: GetCompanyIdDto): Promise<Group[]> {
    const groups = await this.groupRepository.findAll({
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
    const group = await this.groupRepository.findOne({
      where: {
        id,
        company_id,
      },
      include: [{ model: Teacher, attributes: ['id', 'name', 'surname'] }],
    });

    if (!group) {
      throw new NotFoundException({
        message: ['Group not found.'],
      });
    }

    return group;
  }

  async update(updateGroupDto: UpdateGroupDto) {
    const group = await this.findOne(
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
    const group = await this.findOne(
      deleteGroupDto.id,
      deleteGroupDto.company_id,
    );
    try {
      await group.destroy();
    } catch (error) {
      if (error.parent.code === '23503') {
        throw new ConflictException({
          message: [
            'Group can not be deleted. Delete relations with student or teacher first!',
          ],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
