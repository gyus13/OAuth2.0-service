import { ApiProperty } from '@nestjs/swagger';

export class PatchDeliveryRequestDto {
  @ApiProperty({
    example: 'delivering',
    description: '배송상태',
    required: true,
  })
  deliveryStatus: string;
}
