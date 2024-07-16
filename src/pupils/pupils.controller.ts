import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { PupilsService } from './pupils.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Pupil } from './pupils.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from '../helpers/avatar-storage';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// Import DTOs
import { CreatePupilDto } from './dto/create-pupil.dto';
import { UpdatePupilDto } from './dto/update-pupil-dto';
import { ChangeGroupDto } from './dto/change-group.dto';
import { GetCompanyIdDto } from '../company/dto/get-company-id.dto';
import { DeleteAvatarDto } from './dto/delete-avatar.dto';

@ApiTags('Pupils')
@Controller('pupils')
@UseGuards(JwtAuthGuard)
export class PupilsController {
  constructor(private readonly pupilsService: PupilsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Pupil is successfully created.',
    type: Pupil,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async createPupil(
    @Body(new ValidationPipe()) newPupilDto: CreatePupilDto,
  ): Promise<Pupil> {
    return await this.pupilsService.createPupil(newPupilDto);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Change pupil' })
  @ApiResponse({ status: 200, type: Pupil })
  async updatePupil(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updatePupilDto: UpdatePupilDto,
  ): Promise<[number, Pupil[]]> {
    return await this.pupilsService.updatePupil(id, updatePupilDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete pupil' })
  @ApiResponse({ status: 204, type: Pupil })
  async deletePupil(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<void> {
    return await this.pupilsService.deletePupil({ id, ...query });
  }

  @Patch('/pupil-group-change/:id')
  @ApiOperation({ summary: 'Change group of pupil' })
  @ApiResponse({ status: 204, type: Pupil })
  async changePupilGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) changeGroupDto: ChangeGroupDto,
  ): Promise<[number, Pupil[]]> {
    return await this.pupilsService.changePupilGroup(id, changeGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Getting all pupils' })
  @ApiResponse({ status: 200, type: [Pupil] })
  async getAllPupil(@Query() query: GetCompanyIdDto): Promise<Pupil[]> {
    return await this.pupilsService.getAllPupils(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Getting one pupil' })
  @ApiResponse({ status: 200, type: [Pupil] })
  async findOnePupil(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetCompanyIdDto,
  ): Promise<Pupil> {
    return await this.pupilsService.findOnePupil({ id, ...query });
  }

  @Patch('/upload-avatar/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update pupil avatar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar_path: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar_path', avatarStorage))
  async uploadPupilAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file,
    @Query() query: GetCompanyIdDto,
  ): Promise<[number, Pupil[]]> {
    return await this.pupilsService.uploadPupilAvatar(
      id,
      query.company_id,
      file.originalname,
    );
  }

  @Delete('/delete-avatar/:id')
  @ApiOperation({ summary: 'Delete pupil avatar' })
  async deletePupilAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: DeleteAvatarDto,
  ): Promise<[number, Pupil[]]> {
    return await this.pupilsService.deletePupilAvatar(
      id,
      query.avatar_path,
      query.company_id,
    );
  }
}
