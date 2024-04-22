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
import { User } from '../users/users.model';
import { Pupil } from '../pupils/pupils.model';
import { Teacher } from '../teachers/teachers.model';
import { Visits } from '../visits/visits.model';
import { Plan } from '../plans/plans.model';
import { Payment } from '../payments/payment.model';
interface ICompanyAttr {
  company: string;
}
@DefaultScope(() => ({
  attributes: { exclude: ['createdAt', 'updatedAt'] },
}))
@Table({
  tableName: 'companies',
})
export class Company extends Model<Company, ICompanyAttr> {
  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'UUID',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ example: 'Corporation', description: 'Company name' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  company: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Tariff starts day',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  tariff_start_date: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Tariff ends day',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  tariff_end_date: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Tariff ends day',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  tariff_permission: number;

  @ApiProperty({
    example: '0',
    description: 'Plan as number',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  payment_status: number;

  @HasMany(() => Teacher, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  teachers: Teacher[];

  @HasMany(() => Pupil, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  pupils: Pupil[];

  @HasMany(() => Visits, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  visits: Visits[];

  @HasMany(() => Group, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  groups: Group[];

  @HasMany(() => User)
  users: User[];

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Foreign key of plan_id as UUID',
  })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Plan)
  plan_id: string;

  @BelongsTo(() => Plan)
  plan: Plan;

  @HasMany(() => Payment)
  payment: Payment;
}
