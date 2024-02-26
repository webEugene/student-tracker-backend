import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { CompanyService } from '../company/company.service';
import {ForgetPasswordDto} from "./dto/forget-password.dto";
import * as process from "process";
import { MailerService } from "../mailer/mailer.service";
import {ResetPasswordDto} from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private companyService: CompanyService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(loginDto: AuthLoginDto) {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  async registration(registerDto: AuthRegisterDto) {
    const hasCompany = await this.companyService.findOne(registerDto.company);

    if (hasCompany) {
      throw new HttpException(
        'Company already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const company = await this.companyService.create({
      company: registerDto.company,
      plan_id: registerDto.plan_id,
    });

    const newAdmin = await this.userService.getUserByEmail(registerDto.email);
    if (newAdmin) {
      throw new HttpException('Admin already exists!', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(registerDto.password, 5);
    const admin = await this.userService.registerAdmin({
      ...registerDto,
      password: hashPassword,
      company_id: company.id,
    });
    return this.generateToken(admin);
  }

  private async generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      roles: user.roles,
      company_id: user.company_id,
    };

    return {
      userInfo: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        roles: user.roles,
        company_id: user.company_id,
        type_tariff: user.company.plan.plan,
        tariff_permission: user.company.tariff_permission,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: AuthLoginDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEqual = await bcrypt.compare(userDto.password, user.password);

    if (user === null && !passwordEqual) {
      throw new UnauthorizedException({
        message: 'Incorrect password and email',
      });
    }

    if (user === null) {
      throw new UnauthorizedException({ message: 'Incorrect email' });
    }
    if (!passwordEqual) {
      throw new UnauthorizedException({ message: 'Incorrect password' });
    }

    return user;
  }

  async forgetPassword(emailDTO: ForgetPasswordDto): Promise<{ status: HttpStatus.CREATED }> {
    const user: User = await this.userService.getUserByEmail(emailDTO.email);

    if (!user) {
      throw new HttpException('Email is not found', HttpStatus.NOT_FOUND);
    }
    const payload = {
      id: user.id,
      email: user.email,
      company_id: user.company_id,
    };

    const resetToken: string = await this.jwtService.signAsync(
        payload,
        {
          expiresIn: '10m'
        }
    );

    await this.mailerService.sendMail(`${user.name} ${user.surname}`, `${process.env.TEST_FRONT_HOST}/reset-password?resetToken=${resetToken}`);

    return {
      status: HttpStatus.CREATED,
    };
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_NAME
      });
    } catch (e) {
      throw new HttpException('Token has expired or incorrect!', HttpStatus.FORBIDDEN);
    }
  }

  async resetPassword(reset: ResetPasswordDto) {
    // Verify token
    const verifiedToken = await this.verifyToken(reset.token);

    // Check if user exist
    const getUser: User = await this.userService.findOneUser({
      id: verifiedToken.id,
      company_id: verifiedToken.company_id
    });

    if (!getUser) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }

    // Create hashed password
    const hashPassword = await bcrypt.hash(reset.password, 5);

    // Update password
    const updatedUserPassword: [number, User[]] =  await this.userService.resetPassword(getUser.id, getUser.company_id, hashPassword);

    return {
      message: updatedUserPassword[1][0].email,
    }
  }
}
