import {
  Column,
  DataType,
  DefaultScope,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../groups/groups.model';
import { User } from '../users/users.model';
import { Pupil } from '../pupils/pupils.model';
import { Teacher } from '../teachers/teachers.model';
import { Visits } from '../visits/visits.model';
interface ICompanyAttr {
  company: string;
}
@DefaultScope(() => ({
  attributes: { exclude: ['createdAt', 'updatedAt'] },
}))
@Table({
  tableName: 'companies',
})
export class Company extends Model<Company, ICompanyAttr> {
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

  @ApiProperty({ example: 'Corporation', description: 'Company name' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  company: string;

  @HasMany(() => Teacher, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  teachers: Teacher[];

  @HasMany(() => Pupil, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  pupils: Pupil[];

  @HasMany(() => Visits, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  visits: Visits[];

  @HasMany(() => Group, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  groups: Group[];

  @HasMany(() => User)
  users: User[];
}
