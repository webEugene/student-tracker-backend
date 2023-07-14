import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './users.model';
import { AuthRegisterDto } from '../auth/dto/auth-register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/admin')
  @ApiCreatedResponse({
    description: 'User(admin) is successfully created.',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async registerAdmin(@Body() adminDto: AuthRegisterDto): Promise<User> {
    return this.usersService.registerAdmin(adminDto);
  }

  @Post('/new')
  @ApiCreatedResponse({
    description: 'User(user) is successfully created.',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @UseGuards(JwtAuthGuard)
  async create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Change user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<[number, User[]]> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, type: User })
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<void> {
    return await this.usersService.deleteUser({ id, ...query });
  }

  @Delete('/admin/:id')
  @ApiOperation({ summary: 'Delete admin and company' })
  @ApiResponse({ status: 204, type: User })
  @UseGuards(JwtAuthGuard)
  async deleteAdminAndCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ) {
    return await this.usersService.deleteAdminAndCompany({ id, ...query });
  }

  @Get()
  @ApiOperation({ summary: 'Getting all users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Query() query: GetCompanyIdDto): Promise<User[]> {
    return this.usersService.getAllUsers(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find one user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<User> {
    return await this.usersService.findOneUser({ id, ...query });
  }

  @Get('/admin/:id')
  @ApiOperation({ summary: 'Find one user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  async findUserAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<User> {
    return await this.usersService.findUserAdmin({ id, ...query });
  }
}
