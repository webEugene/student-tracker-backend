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
import { Company } from '../company/company.model';

@DefaultScope(() => ({
  attributes: { exclude: ['updatedAt'] },
}))
@Table({
  tableName: 'payments',
})
export class Payment extends Model<Payment> {
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

  @ApiProperty({ example: '0', description: 'Type plan' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  plan: number;

  @ApiProperty({ example: '20000', description: 'Price for plan' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  amount: string;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Foreign key of company_id as UUID',
  })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Company)
  company_id: string;

  @ApiProperty({ example: 'UAH', description: 'Currency type' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;

  @ApiProperty({ example: 'approved', description: 'Order payment status' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  payment_status: string;

  @ApiProperty({
    example: '19.08.2023 23:04:22',
    description: 'Time of payment',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  payment_time: string;

  @ApiProperty({
    example: '0000000',
    description: 'payment_id of payment',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  payment_id: number;

  @ApiProperty({
    example: '7574b0916a4dba9c9cb2ed7d86de1a254996180e',
    description: 'signature of payment',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  signature: string;

  @BelongsTo(() => Company, 'company_id')
  company: Company;

  onDelete: 'CASCADE';
}
