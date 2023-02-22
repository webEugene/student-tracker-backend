import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Visits } from './visits.model';
import { CreateCameVisitDto } from './dto/create-came-visit.dto';
import { CreateLeftVisitDto } from './dto/create-left-visit.dto';
import { DeleteVisitDto } from './dto/delete-visit.dto';

@Injectable()
export class VisitsService {
  constructor(@InjectModel(Visits) private visitRepository: typeof Visits) {}

  async cameAtVisit(dto: CreateCameVisitDto): Promise<Visits> {
    return await this.visitRepository.create(dto);
  }

  async addLeftAtVisit(
    id: string,
    addLeftAtVisitDto: CreateLeftVisitDto,
  ): Promise<[number, Visits[]]> {
    return await this.visitRepository.update(
      { ...addLeftAtVisitDto },
      { where: { id }, returning: true },
    );
  }

  async deletePupilVisits(deleteVisitDto: DeleteVisitDto): Promise<void> {
    const deletedAllPupilVisits = await this.visitRepository.findAll({
      where: {
        company_id: deleteVisitDto.company_id,
      },
    });
    const selectVisitsIds = deletedAllPupilVisits.map(item => item.id);

    await Visits.destroy({ where: { id: selectVisitsIds } });
  }
}
