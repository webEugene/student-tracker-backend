import { Inject, Injectable } from '@nestjs/common';
import { Visits } from './visits.model';
import { CreateCameVisitDto } from './dto/create-came-visit.dto';
import { CreateLeftVisitDto } from './dto/create-left-visit.dto';
import { DeleteVisitByCompanyDto } from './dto/delete-visit-by-company.dto';
import { DeletePupilVisitDto } from './dto/delete-pupil-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @Inject('VISIT_REPOSITORY') private visitRepository: typeof Visits,
  ) {}

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

  async deleteAllCompanyVisits(
    deleteAllCompanyVisitsDto: DeleteVisitByCompanyDto,
  ): Promise<void> {
    const allPupilVisits: Visits[] = await this.visitRepository.findAll({
      where: {
        company_id: deleteAllCompanyVisitsDto.company_id,
      },
    });
    const selectVisitsIds: string[] = allPupilVisits.map(item => item.id);

    await Visits.destroy({ where: { id: selectVisitsIds } });
  }

  async deletePupilVisits(
    deletePupilVisitDto: DeletePupilVisitDto,
  ): Promise<void> {
    const allPupilVisits: Visits[] = await this.visitRepository.findAll({
      where: {
        pupil_id: deletePupilVisitDto.pupil_id,
        company_id: deletePupilVisitDto.company_id,
      },
    });
    const selectVisitsIds: string[] = allPupilVisits.map(item => item.id);

    await Visits.destroy({ where: { id: selectVisitsIds } });
  }
}
