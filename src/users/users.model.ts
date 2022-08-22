import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { Company } from '../company/company.model';

interface IUserCreationAttrs {
  name: string;
  surname: string;
  email: string;
  password: string;
}
@DefaultScope(() => ({
  attributes: { exclude: ['createdAt', 'updatedAt'] },
}))
@Table({ tableName: 'users' })
export class User extends Model<User, IUserCreationAttrs> {
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

  @ApiProperty({ example: 'Ivan', description: 'User name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'Ivanov', description: 'User surname' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  surname: string;

  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: 'qwerty', description: 'Unique password' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Foreign key of company_id as UUID',
  })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Company)
  company_id: string;

  @BelongsTo(() => Company, 'company_id')
  company: Company;
}
