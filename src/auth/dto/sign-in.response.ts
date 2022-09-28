import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { BaseResponse } from '../../config/response.utils';

class SignInResponseData {
  @ApiProperty({
    example: '123123167867',
    description: 'id',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: '닉네임',
    description: 'nickname',
    required: true,
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 'imageurl',
    description: 'characterImageUrl',
    required: true,
  })
  @IsString()
  characterImageUrl: string;

  @ApiProperty({
    example:
      'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJzdWIiOiIxMjM0IiwiaWF0IjoxNjU2NTA2Mjc4LCJleHAiOjE2ODgwNjM4Nzh9.-T-FQ-j1KkvGuzXOlKbyyJ5II1lWH6o_h8QAG4YJwJM',
    description: 'jwtToken',
    required: true,
  })
  @IsString()
  jwtToken: string;
}

export abstract class SignInResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: SignInResponseData;
}
