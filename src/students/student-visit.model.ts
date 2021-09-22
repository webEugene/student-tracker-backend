import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface StudentCreationAttrs {
  name: string;
  surname: string;
  avatar: string;
  email: string;
  phone: string;
  birthday: string;
  came_at: string;
  leave_at: string;
  taken_away: string;
}

@Table({ tableName: 'students' })
export class Student extends Model<Student, StudentCreationAttrs> {
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
  @ApiProperty({ example: 'image.png', description: 'Student avatar' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar: string;
  @ApiProperty({ example: '12/12/2017', description: 'Student birthday' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  birthday: string;
  @ApiProperty({
    example: '12/12/2017-10:22',
    description: 'Date and time of come',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  came_at: string;
  @ApiProperty({
    example: '12/12/2017-14:22',
    description: 'Date and time of leave',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  leave_at: string;
  @ApiProperty({
    example: 'By father',
    description: 'Taken by someone',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  taken_away: string;
}
