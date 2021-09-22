import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface StudentCreationAttrs {
  name: string;
  surname: string;
  avatar: string;
  email: string;
  phone: string;
  birthday: string;
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
    example: 'email@email.com',
    description: "Student's parent's email",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;
  @ApiProperty({
    example: '123456768',
    description: "Student's parent's phone",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;
}
