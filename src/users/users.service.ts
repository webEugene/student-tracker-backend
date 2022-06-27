import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { RolesService } from '../roles/roles.service';
import { AuthRegisterDto } from '../auth/dto/auth-register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../roles/roles.model';
import { Teacher } from '../teachers/teachers.model';
import { Group } from '../groups/groups.model';
import { UpdateTeacherDto } from '../teachers/dto/update-teacher.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async registerAdmin(dto: AuthRegisterDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValue('admin');
    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const isUserExist = await this.getUserByEmail(userDto.email);
    if (isUserExist) {
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userRepository.create({
      ...userDto,
      password: hashPassword,
    });
    const role = await this.roleService.getRoleByValue('user');

    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({
      include: [
        {
          model: Role,
          where: {
            value: 'user',
          },
          attributes: ['value', 'description'],
          through: { attributes: [] },
        },
      ],
    });
    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ['value', 'description'],
          through: { attributes: [] },
        },
      ],
    });
    console.log(user);
    return user;
  }

  async findOneUser(id: string): Promise<User> {
    const user = await this.findOne(id);
    return user;
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Role,
          attributes: ['value', 'description'],
          through: { attributes: [] },
        },
      ],
    });
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<[number, User[]]> {
    const updateUser = await this.userRepository.update(
      { ...updateUserDto },
      { where: { id }, returning: true },
    );
    return updateUser;
  }

  async deleteUser(id: string): Promise<void> {
    const deleteUser = await this.findOne(id);
    await deleteUser.destroy();
  }
}
