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
import filterIds from '../helpers/helpersList';
import { Teacher } from '../teachers/teachers.model';
import { Group } from '../groups/groups.model';
import { Student } from '../students/students.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private teacherService: TeachersService,
    private groupsService: GroupsService,
    private studentsService: StudentsService,
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

  async getAllUsers(query: GetCompanyIdDto): Promise<User[]> {
    const users = await this.userRepository.findAll({
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
    return user;
  }

  async findOneUser(findOneUserDto: IdAndCompanyIdDto): Promise<User> {
    const user = await this.findOne(
      findOneUserDto.id,
      findOneUserDto.company_id,
    );
    return user;
  }

  async findOne(id: string, company_id: string): Promise<User> {
    return this.userRepository.findOne({
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
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<[number, User[]]> {
    const updateUser = await this.userRepository.update(
      { ...updateUserDto },
      { where: { id, company_id: updateUserDto.company_id }, returning: true },
    );
    return updateUser;
  }

  async deleteUser(deleteUserDto: IdAndCompanyIdDto): Promise<void> {
    const deleteUser = await this.findOne(
      deleteUserDto.id,
      deleteUserDto.company_id,
    );
    await deleteUser.destroy();
  }

  async deleteAdminAndCompany(deleteEverything: IdAndCompanyIdDto) {
    const findAllTeachers = await this.teacherService.getAllTeachers({
      company_id: deleteEverything.company_id,
    });
    const findAllGroups = await this.groupsService.findAllGroups({
      company_id: deleteEverything.company_id,
    });
    const findAllStudents = await this.studentsService.getAllStudents({
      company_id: deleteEverything.company_id,
    });
    const teachersIds = filterIds(findAllTeachers);
    const studentsIds = filterIds(findAllStudents);
    const groupsIds = filterIds(findAllGroups);
    if (teachersIds.length !== 0) {
      await Teacher.destroy({ where: { id: teachersIds } });
    }
    if (studentsIds.length !== 0) {
      await Student.destroy({ where: { id: studentsIds } });
    }
    if (groupsIds.length !== 0) {
      await Group.destroy({ where: { id: groupsIds } });
    }

    await User.destroy({ where: { id: deleteEverything.id } });

    await Company.destroy({ where: { id: deleteEverything.company_id } });
  }
}
