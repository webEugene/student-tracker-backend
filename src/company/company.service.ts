import { InjectModel } from '@nestjs/sequelize';
import { CreateCompanyDto } from './dto/create-company.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
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

    // if (!companyName) {
    //   throw new NotFoundException({
    //     message: ['company not found.'],
    //   });
    // }

    return companyName;
  }
}
