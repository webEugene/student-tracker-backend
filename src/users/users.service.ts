import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './users.model';
import { RolesService } from '../roles/roles.service';
import { AuthRegisterDto } from '../auth/dto/auth-register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../roles/roles.model';
import { Company } from '../company/company.model';
import { Pupil } from '../pupils/pupils.model';
import { Group } from '../groups/groups.model';
import { Teacher } from '../teachers/teachers.model';
import { Plan } from '../plans/plans.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { IdAndCompanyIdDto } from '../common/dto/id-and-company-id.dto';
import { VisitsService } from '../visits/visits.service';
import { ImagesService } from '../images/images.service';
import { Payment } from '../payments/payment.model';
import { RoleEnum } from '../roles/enum/role.enum';
import planEnum from '../common/enums/plan.enum';
import exceptionMessages from './enum/exceptionMessages.enum';
import permissionsUser from '../common/enums/permissionUser.enum';
import { PaymentsService } from '../payments/payments.service';
import PaymentList from './type/payment-list.type';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: typeof User,
    private roleService: RolesService,
    private visitsService: VisitsService,
    private imagesService: ImagesService,
    private paymentsService: PaymentsService,
  ) {}

  async registerAdmin(dto: AuthRegisterDto): Promise<User> {
    const admin: User = await this.userRepository.create(dto);
    const role: Role = await this.roleService.getRoleByValue(RoleEnum.ADMIN);
    await admin.$set('roles', [role.id]);
    admin.roles = [role];

    return await this.getUserByEmail(admin.email);
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const tariff_permission: string = planEnum[userDto.tariff_permission];

    const countUserRows: number = await this.userRepository.count({
      where: {
        company_id: userDto.company_id,
      },
    });

    if (countUserRows > permissionsUser[tariff_permission]) {
      throw new HttpException(
        {
          message: [exceptionMessages.PermissionError],
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const isUserExist = await this.getUserByEmail(userDto.email);
    if (isUserExist) {
      throw new ConflictException({
        message: [exceptionMessages.DuplicateError],
      });
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userRepository.create({
      ...userDto,
      password: hashPassword,
    });
    const role = await this.roleService.getRoleByValue(RoleEnum.USER);

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
            value: RoleEnum.USER,
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
        {
          model: Company,
          attributes: ['company', 'tariff_permission'],
          include: [
            {
              model: Plan,
            },
          ],
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
      attributes: { exclude: ['password'] },
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

  async findUserAdmin(findOneUserDto: IdAndCompanyIdDto): Promise<User> {
    const admin = this.userRepository.findOne({
      where: {
        id: findOneUserDto.id,
        company_id: findOneUserDto.company_id,
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Role,
          attributes: ['value', 'description'],
          through: { attributes: [] },
        },
        {
          model: Company,
          include: [
            {
              model: Plan,
            },
          ],
        },
      ],
    });

    if (admin) {
      return admin;
    }
    throw new HttpException(
      'Admin with this name does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<[number, User[]]> {
    try {
      return await this.userRepository.update(
        { ...updateUserDto },
        {
          where: { id, company_id: updateUserDto.company_id },
          returning: true,
        },
      );
    } catch (error) {
      if (error.parent.code === '23505') {
        throw new ConflictException({
          message: [exceptionMessages.DuplicateDataError],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async resetPassword(
    id: string,
    company_id: string,
    password: string,
  ): Promise<[number, User[]]> {
    try {
      return await this.userRepository.update(
        { password },
        {
          where: { id, company_id },
          returning: true,
        },
      );
    } catch (error) {
      if (error.parent.code === '23505') {
        throw new ConflictException({
          message: [exceptionMessages.DuplicateDataError],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteUser(deleteUserDto: IdAndCompanyIdDto): Promise<void> {
    const user = await this.findOne(deleteUserDto.id, deleteUserDto.company_id);
    try {
      await user.destroy();
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

  async deleteAdminAndCompany(deleteEverything: IdAndCompanyIdDto) {
    // Delete visits
    await this.visitsService.deletePupilVisits({
      company_id: deleteEverything.company_id,
    });
    // Delete all users created admin and current component
    await Teacher.destroy({ where: { id: deleteEverything.id } });
    await Pupil.destroy({ where: { id: deleteEverything.id } });
    await Group.destroy({ where: { id: deleteEverything.id } });
    // Delete company folder where avatars had been saved!
    this.imagesService.removeCompanyAvatarFolder(deleteEverything.company_id);
    await User.destroy({ where: { id: deleteEverything.id } });
    await Company.destroy({ where: { id: deleteEverything.company_id } });
  }

  async getPaymentsListAdmin(
    findOneUserDto: IdAndCompanyIdDto,
  ): Promise<PaymentList[]> {
    const admin: User = await this.userRepository.findOne({
      where: {
        id: findOneUserDto.id,
        company_id: findOneUserDto.company_id,
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Company,
          attributes: [
            'payment_status',
            'tariff_start_date',
            'tariff_end_date',
          ],
        },
      ],
    });

    let structurePaymentResponse: PaymentList[] = [];

    const getPayments: Payment[] =
      await this.paymentsService.findAllPaymentsByCompanyId(admin.company_id);

    if (getPayments.length) {
      getPayments.forEach(payment => {
        structurePaymentResponse.push({
          amount: payment.amount,
          currency: payment.currency,
          status: admin.company.payment_status,
          plan: payment.plan,
          tariff_start_date: admin.company.tariff_start_date,
          tariff_end_date: admin.company.tariff_end_date,
        });
      });
    }

    return structurePaymentResponse;
  }
}
