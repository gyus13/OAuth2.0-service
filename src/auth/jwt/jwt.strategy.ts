import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from '../../config/response.utils';
import { User } from '../../entity/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
            secretOrKey: 'secret',
            ignoreExpiration: false,
        });
    }

    async validate(payload: Payload) {
        // User 정보 추출
        const admin = await this.userRepository.findOne({
            where: { id: payload.sub, status: 'ACTIVE' },
        });
        // 유저가 존재하지 않는 경우
        if (admin == undefined) {
            throw new HttpException(response.NON_EXIST_USER, 201);
        }
        // payload값 user로 리턴
        return payload;
    }
}
