import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Pupil } from '../pupils/pupils.model';
import { Company } from '../company/company.model';

interface IVisit {
  came_at?: string;
  brought?: number;
  left_at?: string;
  took?: number;
  pupil_id: string;
  came_confirmer: string;
  left_confirmer?: string;
}

@DefaultScope(() => ({
  attributes: { exclude: ['updatedAt'] },
}))
@Table({ tableName: 'visits' })
export class Visits extends Model<Visits, IVisit> {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Primary Key UUID',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Came date and time',
  })
  @Column({
    type: DataType.DATE,
    defaultValue: null,
    allowNull: true,
  })
  came_at: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Date and time of leave',
  })
  @Column({
    type: DataType.DATE,
    defaultValue: null,
    allowNull: true,
  })
  left_at: string;

  @ApiProperty({
    example: 2,
    description: 'Brought by someone',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  brought: number;

  @ApiProperty({
    example: 2,
    description: 'Took by someone',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  took: number;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Foreign key of pupil_id as UUID',
  })
  @ForeignKey(() => Pupil)
  @Column({ type: DataType.UUID })
  pupil_id: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Foreign key of company_id as UUID',
  })
  @Column({ type: DataType.UUID, allowNull: false })
  @ForeignKey(() => Company)
  company_id: string;

  @BelongsTo(() => Company, 'company_id')
  company: Company;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Date and time of creation',
  })
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    defaultValue: null,
  })
  createdAt: string;

  @ApiProperty({
    example: 'Tom Tomas',
    description: 'name of the confirmer',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  came_confirmer: string;

  @ApiProperty({
    example: 'Tom Tomas',
    description: 'name of the confirmer',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  left_confirmer: string;
}
