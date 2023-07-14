import {
  Column,
  DataType,
  DefaultScope,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.model';

@DefaultScope(() => ({
  attributes: { exclude: ['createdAt', 'updatedAt'] },
}))
@Table({
  tableName: 'plans',
})
export class Plan extends Model<Plan> {
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

  @ApiProperty({ example: 'Lorem', description: 'Description plan' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @ApiProperty({ example: '200.00', description: 'Price for plan' })
  @Column({
    type: DataType.DECIMAL(6, 2),
    allowNull: true,
  })
  price: number;

  @ApiProperty({ example: 'UAH', description: 'Currency code' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  currency_code: string;

  @ApiProperty({ example: 'UA', description: 'Country code' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  country_code: string;

  @HasMany(() => Company)
  companies: Company[];
}
