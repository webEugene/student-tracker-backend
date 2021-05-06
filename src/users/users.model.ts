import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;
  @ApiProperty({ example: 'qwerty', description: 'Unique password' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
}
