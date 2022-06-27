import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './groups.model';
import { Student } from '../students/students.model';
import { Teacher } from '../teachers/teachers.model';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group) private groupRepository: typeof Group) {}

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

  async findAll(): Promise<Group[]> {
    const groups = await this.groupRepository.findAll({
      include: [
        { model: Student, attributes: ['id', 'name', 'surname'] },
        { model: Teacher, attributes: ['id', 'name', 'surname'] },
      ],
    });

    if (!groups) {
      throw new NotFoundException({
        message: ['Groups not found.'],
      });
    }

    return groups;
  }

  async onlyGroupsFind(): Promise<Group[]> {
    const groups = await this.groupRepository.findAll();

    if (!groups) {
      throw new NotFoundException({
        message: ['Groups not found.'],
      });
    }

    return groups;
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: {
        id,
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

  async update(UpdateGroupDto: UpdateGroupDto) {
    const group = await this.findOne(UpdateGroupDto.id);
    return await this.groupRepository.update(UpdateGroupDto, {
      where: { id: group.id },
    });
  }

  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    await group.destroy();
  }
}
