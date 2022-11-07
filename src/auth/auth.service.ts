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

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private companyService: CompanyService,
    private jwtService: JwtService,
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
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: AuthLoginDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (user === null) {
      throw new UnauthorizedException({ message: 'Incorrect email' });
    }
    const passwordEqual = await bcrypt.compare(userDto.password, user.password);
    if (!passwordEqual) {
      throw new UnauthorizedException({ message: 'Incorrect password' });
    }
    if (user === null && !passwordEqual) {
      throw new UnauthorizedException({
        message: 'Incorrect password and email',
      });
    }

    return user;
  }
}
