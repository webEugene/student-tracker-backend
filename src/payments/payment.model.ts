import {
  BelongsTo,
  Column,
  DataType,
  Default,
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

  @ApiProperty({ example: '200.00', description: 'Price for plan' })
  @Column({
    type: DataType.DECIMAL(6, 2),
    allowNull: false,
  })
  price: number;

  @ApiProperty({ example: 'false', description: 'Test period for free usage' })
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  test_period: boolean;

  @ApiProperty({
    example: '994ba8ac-a052-4194-805b-589204b45716',
    description: 'Foreign key of company_id as UUID',
  })
  @Column({ type: DataType.UUID })
  @ForeignKey(() => Company)
  company_id: string;

  @BelongsTo(() => Company, 'company_id')
  company: Company;

  onDelete: 'CASCADE';
}
