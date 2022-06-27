import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Group } from './groups.model';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Create new group' })
  @ApiResponse({ status: 201, type: Group })
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.create(createGroupDto);
  }

  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, type: [Group] })
  @Get()
  async findAll() {
    return await this.groupsService.findAll();
  }

  @ApiOperation({ summary: 'Update group' })
  @ApiResponse({ status: 200, type: Group })
  @Patch()
  async update(@Body() UpdateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(UpdateGroupDto);
  }

  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: 200, type: Group })
  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.groupsService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete group by ID' })
  @ApiResponse({ status: 204, type: Group })
  @Delete('/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.groupsService.remove(id);
  }

  @ApiOperation({ summary: 'Get all groups without relations' })
  @ApiResponse({ status: 200, type: [Group] })
  @Get('/list/only')
  async onlyGroupsFind() {
    return await this.groupsService.onlyGroupsFind();
  }
}
