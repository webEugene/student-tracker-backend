import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';

interface IUserCreationAttrs {
  email: string;
  username: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, IUserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;
  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;
  @ApiProperty({ example: 'Ivan', description: 'Username' })
  @Column({ type: DataType.STRING, allowNull: false })
  username: string;
  @ApiProperty({ example: 'qwerty', description: 'Unique password' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
  @ApiProperty({ example: 'Ivanov', description: 'surname' })
  @Column({ type: DataType.STRING, allowNull: true })
  surname?: string;
  @ApiProperty({ example: 'Male', description: 'gender' })
  @Column({ type: DataType.STRING, allowNull: true })
  gender?: string;
  @ApiProperty({ example: 'Male', description: 'birthday' })
  @Column({ type: DataType.DATE, allowNull: true })
  birthday?: string;
  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
