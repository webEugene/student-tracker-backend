import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthRegisterDto } from '../auth/dto/auth-register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../roles/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateTeacherDto } from '../teachers/dto/update-teacher.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/admin')
  async registerAdmin(@Body() adminDto: AuthRegisterDto) {
    return this.usersService.registerAdmin(adminDto);
  }

  @Post('/new')
  @UseGuards(JwtAuthGuard)
  async create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Getting all users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  // @Roles(Role.Admin)
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOneUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteTeacher(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUser(id);
  }
}
