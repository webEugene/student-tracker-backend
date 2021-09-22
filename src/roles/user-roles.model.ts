import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Role } from './roles.model';

@Table({
  tableName: 'user_roles',
})
export class UserRoles extends Model<UserRoles> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID })
  roleId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;
}
