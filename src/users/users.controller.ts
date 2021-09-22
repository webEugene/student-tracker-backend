import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Creating new user' })
  @ApiResponse({ status: 201, type: User })
  @Post()
  async create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Getting all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Getting all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  async test() {
    return 'Success!';
  }
}
