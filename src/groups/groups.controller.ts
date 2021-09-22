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
  HttpStatus,
  HttpCode,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
// import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Group } from './group.model';
import { UpdateGroupDto } from './dto/update-group.dto';

@ApiTags('Users')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Creating new group' })
  @ApiResponse({ status: 201, type: Group })
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.create(createGroupDto);
  }

  @ApiOperation({ summary: 'Getting all groups' })
  @ApiResponse({ status: 200, type: [Group] })
  @Get()
  async findAll() {
    return await this.groupsService.findAll();
  }

  @Put()
  async update(@Body() UpdateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(UpdateGroupDto);
  }

  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.groupsService.findOne(id);
  }

  @HttpCode(204)
  @Delete('/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.groupsService.remove(id);
  }
}
