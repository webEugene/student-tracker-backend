import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../groups/groups.model';
import { Company } from '../company/company.model';

interface ITeacherCreationAttrs {
  name: string;
  surname: string;
  mobilePhone: string;
  birthday: string;
  avatar_path: string;
  group_id: string;
}

@DefaultScope(() => ({
  attributes: {
    exclude: ['group_id', 'createdAt', 'updatedAt'],
  },
}))
@Table({ tableName: 'teachers' })
export class Teacher extends Model<Teacher, ITeacherCreationAttrs> {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Primary Key UUID',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ example: 'Ivan', description: 'Teacher name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'Ivanov', description: 'Teacher surname' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  surname: string;

  @ApiProperty({ example: '+380961234567', description: 'Mobile Phone' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mobilePhone: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Teacher birthday',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthday: string;

  @ApiProperty({ example: 'image.png', description: 'Teacher avatar' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar_path: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Foreign key of group_id as UUID',
  })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Group)
  group_id: string;

  @BelongsTo(() => Group)
  group: Group;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Foreign key of company_id as UUID',
  })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Company)
  company_id: string;

  @BelongsTo(() => Company, 'company_id')
  company: Company;

  onDelete: 'RESTRICT';
}
