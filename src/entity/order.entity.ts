import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { CouponEntity } from './coupon.entity';

@Entity('ORDER')
export class OrderEntity extends CommonEntity {
  @ApiProperty()
  @Column()
  endedAt: string;

  @ApiProperty()
  @Column()
  deliveryStatus: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty({ description: '주문자' })
  @ManyToOne(() => UserEntity, { eager: true })
  userId: number;

  @ApiProperty({ description: '쿠폰' })
  @ManyToOne(() => CouponEntity, { eager: true })
  couponId: number;
}
