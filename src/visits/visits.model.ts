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
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;
  @Column({
    type: DataType.DATE,
    defaultValue: null,
    allowNull: true,
  })
  came_at: string;
  @ApiProperty({
    example: '12-12-2017-14:22',
    description: 'Date and time of leave',
  })
  @Column({
    type: DataType.DATE,
    defaultValue: null,
    allowNull: true,
  })
  left_at: string;
  @ApiProperty({
    example: 'By mother',
    description: 'Brought by someone',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  brought: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  took: number;

  @ForeignKey(() => Student)
  @Column({ type: DataType.UUID })
  student_id: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    defaultValue: null,
  })
  createdAt: string;
}
