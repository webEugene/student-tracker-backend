import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Visits } from './visits.model';
import { CreateCameVisitDto } from './dto/create-came-visit.dto';
import { CreateLeftVisitDto } from './dto/create-left-visit.dto';

@Injectable()
export class VisitsService {
  constructor(@InjectModel(Visits) private visitRepository: typeof Visits) {}

  async cameAtVisit(dto: CreateCameVisitDto): Promise<Visits> {
    const cameAtVisit = await this.visitRepository.create(dto);
    return cameAtVisit;
  }

  async addLeftAtVisit(
    id: string,
    addLeftAtVisitDto: CreateLeftVisitDto,
  ): Promise<[number, Visits[]]> {
    const isAddedLeft = await this.visitRepository.update(
      { ...addLeftAtVisitDto },
      { where: { id }, returning: true },
    );
    return isAddedLeft;
  }
}
