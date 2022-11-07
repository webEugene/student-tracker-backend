import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { RolesService } from '../roles/roles.service';
import { AuthRegisterDto } from '../auth/dto/auth-register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../roles/roles.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { IdAndCompanyIdDto } from '../common/dto/id-and-company-id.dto';
import { Company } from '../company/company.model';
import { TeachersService } from '../teachers/teachers.service';
import { GroupsService } from '../groups/groups.service';
import { StudentsService } from '../students/students.service';
import { VisitsService } from '../visits/visits.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private teacherService: TeachersService,
    private groupsService: GroupsService,
    private studentsService: StudentsService,
    private visitsService: VisitsService,
  ) {}

  async registerAdmin(dto: AuthRegisterDto): Promise<User> {
    const admin = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValue('admin');
    await admin.$set('roles', [role.id]);
    admin.roles = [role];

    return admin;
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

  async getAllUsers(query: GetCompanyIdDto): Promise<User[]> {
    return await this.userRepository.findAll({
      where: {
        company_id: query.company_id,
      },
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
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ['value', 'description'],
          through: { attributes: [] },
        },
      ],
    });
  }

  async findOneUser(findOneUserDto: IdAndCompanyIdDto): Promise<User> {
    const user = await this.findOne(
      findOneUserDto.id,
      findOneUserDto.company_id,
    );
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.FORBIDDEN,
    );
  }

  async findOne(id: string, company_id: string): Promise<User> {
    const user = this.userRepository.findOne({
      where: {
        id,
        company_id,
      },
      include: [
        {
          model: Role,
          attributes: ['value', 'description'],
          through: { attributes: [] },
        },
        {
          model: Company,
          attributes: ['company'],
        },
      ],
    });

    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<[number, User[]]> {
    return await this.userRepository.update(
      { ...updateUserDto },
      { where: { id, company_id: updateUserDto.company_id }, returning: true },
    );
  }

  async deleteUser(deleteUserDto: IdAndCompanyIdDto): Promise<void> {
    const deleteUser = await this.findOne(
      deleteUserDto.id,
      deleteUserDto.company_id,
    );
    await deleteUser.destroy();
  }

  async deleteAdminAndCompany(deleteEverything: IdAndCompanyIdDto) {
    // Delete visits
    await this.visitsService.deleteStudentVisits({
      company_id: deleteEverything.company_id,
    });
    // Delete all users created admin and current component
    await User.destroy({ where: { id: deleteEverything.id } });
    // Delete avatars
    await User.destroy({ where: { id: deleteEverything.id } });

    await Company.destroy({ where: { id: deleteEverything.company_id } });
  }
}
