import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../students/students.model';
import { Teacher } from '../teachers/teachers.model';
import { Company } from '../company/company.model';

interface IGroupAttr {
  name: string;
}
@DefaultScope(() => ({
  attributes: { exclude: ['createdAt', 'updatedAt'] },
}))
@Table({
  tableName: 'groups',
})
export class Group extends Model<Group, IGroupAttr> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;
  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @HasMany(() => Student)
  students: Student[];

  @HasOne(() => Teacher, {
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
    hooks: true,
  })
  teacher: Teacher;

  @ApiProperty({
    example: '1',
    description: 'Foreign key of company_id as UUID',
  })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Company)
  company_id: string;

  @BelongsTo(() => Company)
  company: Company;
}
