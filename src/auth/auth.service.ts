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
    const companyCheck = await this.companyService.findOne(registerDto.company);
    if (companyCheck) {
      throw new HttpException(
        'Company already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const candidate = await this.userService.getUserByEmail(registerDto.email);
    if (candidate) {
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }
    await this.companyService.create({
      company: registerDto.company,
    });

    const hashPassword = await bcrypt.hash(registerDto.password, 5);
    const user = await this.userService.registerAdmin({
      ...registerDto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };

    return {
      userInfo: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        roles: user.roles,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: AuthLoginDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (user === null) {
      throw new UnauthorizedException({ massage: 'Incorrect email' });
    }
    const passwordEqual = await bcrypt.compare(userDto.password, user.password);
    if (!passwordEqual) {
      throw new UnauthorizedException({ massage: 'Incorrect password' });
    }
    if (user === null && !passwordEqual) {
      throw new UnauthorizedException({
        massage: 'Incorrect password and email',
      });
    }

    return user;
    // if (user === null || !passwordEqual) {
    //   throw new UnauthorizedException({
    //     massage: 'Incorrect password or email',
    //   });
    // }
    // return user;
  }
}
