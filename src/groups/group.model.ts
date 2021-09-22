import {
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../students/students.model';

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

  @HasMany(() => Student, 'studentId')
  // @ForeignKey(() => Student)
  students: Student[];
}
