import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './group.model';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group) private groupRepository: typeof Group) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupRepository.create(createGroupDto);
  }

  async findAll(): Promise<Group[]> {
    return await this.groupRepository.findAll();
  }

  async findOne(id: string): Promise<Group> {
    return await this.groupRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(UpdateGroupDto: UpdateGroupDto) {
    return await this.groupRepository.update(UpdateGroupDto, {
      where: { id: UpdateGroupDto.id },
    });
  }

  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    await group.destroy();
  }
}
