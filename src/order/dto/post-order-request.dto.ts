import { ApiProperty } from '@nestjs/swagger';

export class PostOrderRequestDto {
  @ApiProperty({
    example: 10000,
    description: '가격',
    required: true,
  })
  price: number;

  @ApiProperty({
    example: 1,
    description: 'userId',
    required: true,
  })
  userId: number;

  @ApiProperty({
    example: 1,
    description: '쿠폰 id',
    required: false,
  })
  couponId: number;
}
