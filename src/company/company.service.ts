import { InjectModel } from '@nestjs/sequelize';
import { CreateCompanyDto } from './dto/create-company.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Company } from './company.model';
import { ImagesService } from '../images/images.service';

export class CompanyService {
  constructor(
    @InjectModel(Company) private companyRepository: typeof Company,
    private imageService: ImagesService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const createdCompanyData = await this.companyRepository.create(
        createCompanyDto,
      );
      this.imageService.createDirectory(createdCompanyData.id);

      return createdCompanyData;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          message: ['Company is already exists'],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async findOne(company: string): Promise<Company> {
    return await this.companyRepository.findOne({
      where: {
        company,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);

    try {
      this.imageService.removeCompanyAvatarFolder(company.id);
      await company.destroy();
    } catch (error) {
      if (error.parent.code === '23503') {
        throw new ConflictException({
          message: ['Company can not be deleted'],
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async setCompanyPlan() {
    // const group = await this.findOne(
    //     updateGroupDto.id,
    //     updateGroupDto.company_id,
    // );
    // return await this.companyRepository.update(updateGroupDto, {
    //   where: {
    //     id: group.id,
    //     company_id: group.company_id,
    //   },
    // });

    return [];
  }
}
