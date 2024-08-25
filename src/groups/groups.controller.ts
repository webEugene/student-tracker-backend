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
  Logger,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Group } from './groups.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';

@ApiBearerAuth()
@ApiTags('Groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  private logger: Logger = new Logger('GroupsController');
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create group' })
  @ApiResponse({ status: 200, type: Group })
  async create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    this.logger.verbose(`Creating group.`);
    return await this.groupsService.create(createGroupDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Change group' })
  @ApiResponse({ status: 200, type: Group })
  async update(@Body() updateGroupDto: UpdateGroupDto): Promise<[number]> {
    this.logger.verbose(`Updating group.`);
    return await this.groupsService.update(updateGroupDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: 204, type: Group })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<void> {
    this.logger.verbose(`Deleting group.`);
    return await this.groupsService.remove({ id, ...query });
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, type: [Group] })
  async findAll(@Query() query: GetCompanyIdDto): Promise<Group[]> {
    this.logger.verbose(`Getting all groups.`);
    return await this.groupsService.findAllGroups(query);
  }

  @Get('/list/only')
  @ApiOperation({ summary: 'Get all groups without relations' })
  @ApiResponse({ status: 200, type: [Group] })
  async onlyGroupsFind(@Query() query: GetCompanyIdDto): Promise<Group[]> {
    this.logger.verbose(`Get all groups without relations.`);
    return await this.groupsService.onlyGroupsFind(query);
  }
}
