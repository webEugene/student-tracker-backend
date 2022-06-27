import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../groups/groups.model';
import { Visits } from '../visits/visits.model';

interface IStudentCreationAttrs {
  name: string;
  surname: string;
  mobilePhone: string;
  gender: string;
  birthday: string;
  avatar_path?: string;
  email?: string;
}

@DefaultScope(() => ({
  attributes: { exclude: ['group_id', 'createdAt', 'updatedAt'] },
}))
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
  @ApiProperty({ example: '380991234567', description: 'Phone number' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mobilePhone: string;
  @ApiProperty({ example: 'male', description: 'gender' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender: string;
  @ApiProperty({ example: '12-12-2017', description: 'Student birthday' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthday: string;
  @ApiProperty({ example: 'image.png', description: 'Student avatar' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar_path: string;
  @ApiProperty({
    example: 'email@email.com',
    description: "Student's parent's email",
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @ApiProperty({ example: '1', description: 'Foreign key of group_id as UUID' })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Group)
  group_id: string;

  @BelongsTo(() => Group)
  group: Group;

  @HasMany(() => Visits)
  visits: [];
}
