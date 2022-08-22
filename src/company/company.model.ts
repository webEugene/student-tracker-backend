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
import { Student } from '../students/students.model';
import { Teacher } from '../teachers/teachers.model';
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

  @HasMany(() => Group)
  groups: Group[];

  @HasMany(() => User)
  users: User[];

  @HasMany(() => Student)
  students: Student[];

  @HasMany(() => Teacher)
  teachers: Teacher[];
}
