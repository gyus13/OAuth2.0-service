import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {

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
