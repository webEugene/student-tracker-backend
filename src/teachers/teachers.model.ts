import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from '../groups/groups.model';
import { ApiProperty } from '@nestjs/swagger';

interface ITeacherCreationAttrs {
  name: string;
  surname: string;
  mobilePhone: string;
  birthday: string;
  avatar_path?: string;
  email?: string;
  group_id?: string;
}

@DefaultScope(() => ({
  attributes: {
    exclude: ['group_id', 'createdAt', 'updatedAt'],
  },
}))
@Table({ tableName: 'teachers' })
export class Teacher extends Model<Teacher, ITeacherCreationAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  surname: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mobilePhone: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthday: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar_path: string;

  @ApiProperty({ example: '1', description: 'Foreign key of group_id as UUID' })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Group)
  group_id: string;

  @BelongsTo(() => Group)
  group: Group;
}
