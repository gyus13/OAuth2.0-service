import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('COUPON')
export class CouponEntity extends CommonEntity {
  @ApiProperty()
  @Column()
  type: string;

  @ApiProperty()
  @Column()
  percent: string;

  @ApiProperty()
  @Column()
  price: string;


}
