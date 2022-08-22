import { InjectModel } from '@nestjs/sequelize';
import { CreateCompanyDto } from './dto/create-company.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Company } from './company.model';

export class CompanyService {
  constructor(
    @InjectModel(Company) private companyRepository: typeof Company,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      return await this.companyRepository.create(createCompanyDto);
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
    const companyName = await this.companyRepository.findOne({
      where: {
        company,
      },
    });

    return companyName;
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    try {
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
}
