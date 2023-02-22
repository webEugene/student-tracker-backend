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
import { Pupil } from '../pupils/pupils.model';
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
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'UUID',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ example: 'Montessori', description: 'Group name' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @HasMany(() => Pupil)
  pupils: Pupil[];

  @HasOne(() => Teacher, {
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
    hooks: true,
  })
  teacher: Teacher;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Foreign key of company_id as UUID',
  })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Company)
  company_id: string;

  @BelongsTo(() => Company, 'company_id')
  company: Company;

  onDelete: 'CASCADE';
}
