import {
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../groups/group.model';

interface IStudentCreationAttrs {
  name: string;
  surname: string;
  phone: string;
  group: string;
  avatar?: string;
  birthday?: string;
  came_at?: string;
  brought?: string;
  left_at?: string;
  took?: string;
}

@Table({ tableName: 'students' })
export class Student extends Model<Student, IStudentCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;
  @ApiProperty({ example: 'Ivan', description: 'Student name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
  @ApiProperty({ example: 'Ivanov', description: 'Student surname' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  surname: string;
  @ApiProperty({ example: 'Group name', description: 'Group name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  student_group: string;
  @ApiProperty({ example: '380991234567', description: 'Phone number' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;
  @ApiProperty({ example: 'image.png', description: 'Student avatar' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar?: string;
  @ApiProperty({ example: '12/12/2017', description: 'Student birthday' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthday?: string;
  @ApiProperty({
    example: '12/12/2017-10:22',
    description: 'Date and time of come',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  came_at?: string;
  @ApiProperty({
    example: '12/12/2017-14:22',
    description: 'Date and time of leave',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  left_at: string;
  @ApiProperty({
    example: 'By mother',
    description: 'Brought by someone',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  brought?: string;
  @ApiProperty({
    example: 'By father',
    description: 'Taken by someone',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  took?: string;

  // @HasOne(() => Group)
  // group: Group;

  @ApiProperty({ example: '1', description: 'Foreign key of groupId as UUID' })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Group)
  groupId: string;
}
