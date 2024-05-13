import { CreateCompanyDto } from './dto/create-company.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Company } from './company.model';
import { ImagesService } from '../images/images.service';
import { ChangeCompanyTariffPlanDto } from './dto/change-tariff.dto';

enum PaymentStatusEnum {
  FREE,
  UNPAID,
  PAID,
  WAITING,
}

export class CompanyService {
  constructor(
    @Inject('COMPANY_REPOSITORY') private companyRepository: typeof Company,
    private imageService: ImagesService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const createdCompanyData =
        await this.companyRepository.create(createCompanyDto);
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
  async findCompanyById(id: string): Promise<Company> {
    return await this.companyRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findCompanyByName(company: string): Promise<Company> {
    return await this.companyRepository.findOne({
      where: {
        company,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const company: Company = await this.findCompanyById(id);

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

  async changeTariffPlan(
    changeTariffPlanDto: ChangeCompanyTariffPlanDto,
  ): Promise<{ status: number }> {
    const company: Company = await this.findCompanyById(
      changeTariffPlanDto.company_id,
    );
    if (company === null) {
      throw new HttpException(
        'Company not found exists!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const payment_status: PaymentStatusEnum =
      changeTariffPlanDto.plan === 0
        ? PaymentStatusEnum.FREE
        : PaymentStatusEnum.UNPAID;

    const getDate: Date = new Date();
    const currentDate: string = new Date().toISOString();
    const addOneMonth: number = getDate.setMonth(getDate.getMonth() + 1);
    const dateToISO: string = new Date(addOneMonth).toISOString();

    const updateTariffStatus: number[] = await this.companyRepository.update(
      {
        plan_id: changeTariffPlanDto.plan_id,
        payment_status,
        tariff_start_date: currentDate,
        tariff_end_date: dateToISO,
      },
      {
        where: {
          id: company.id,
        },
      },
    );
    if (updateTariffStatus[0] !== 1) {
      throw new HttpException(
        'Not updated, try again later',
        HttpStatus.BAD_GATEWAY,
      );
    } else {
      return {
        status: 204,
      };
    }
  }
}
