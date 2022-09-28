import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import {makeResponse} from "../config/function.utils";
import { response } from 'src/config/response.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async verifyGoogle(token) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_SECRET_KEY'),
    );
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_SECET_KEY'), // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      let data = {};
      const payload = ticket.getPayload();
      const userId = Number(payload['sub']);

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      let accountPayload;

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        await this.userRepository.save({
          id: userId,
        });
        accountPayload = { sub: user.id };
        data = {
          id: userId,
          token: this.jwtService.sign(accountPayload),
        };
      } else {
        accountPayload = { sub: user.id };
        data = {
          id: userId,
          token: this.jwtService.sign(accountPayload),
        };
      }

      const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
