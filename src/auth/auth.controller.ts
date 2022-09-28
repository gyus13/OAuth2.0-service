import { Controller, Post, Headers } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInResponse } from './dto/sign-in.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
  })
  @Post('ios/google')
  @ApiOperation({ summary: 'IOS 구글 로그인' })
  @ApiHeader({
    description: 'id-token',
    name: 'id-token',
    example: 'id-TOKEN',
  })
  async GoogleAuth(@Headers('id-token') idToken) {
    return this.authService.verifyGoogle(idToken);
  }
}
