import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('USER')
export class UserEntity extends CommonEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column()
  zip: string;
}
