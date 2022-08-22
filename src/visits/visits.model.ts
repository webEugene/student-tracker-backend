import {
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../students/students.model';

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
    description: 'Foreign key of student_id as UUID',
  })
  @ForeignKey(() => Student)
  @Column({ type: DataType.UUID })
  student_id: string;

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
}
