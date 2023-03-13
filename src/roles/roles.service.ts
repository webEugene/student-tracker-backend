import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
@Injectable()
export class RolesService {
  constructor(@Inject('ROLE_REPOSITORY') private roleRepository: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    return await this.roleRepository.create(dto);
  }

  async getRoleByValue(value: string) {
    return await this.roleRepository.findOne({
      where: { value },
      attributes: ['id', 'value', 'description'],
    });
  }
}
