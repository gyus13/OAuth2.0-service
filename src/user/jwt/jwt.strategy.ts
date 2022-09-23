import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(token) {
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');

    try {
      const verify = this.jwtService.verify(token, { secret: secretKey });
      return verify;
    } catch (e) {
      switch (e.name) {
        case 'JsonWebTokenError':
          throw new HttpException('유효하지 않은 토큰', 401);

        case 'TokenExpiredError':
          throw new HttpException('토큰 만료', 410);

        default:
          throw new HttpException('서버 오류', 500);
      }
    }
  }
}
