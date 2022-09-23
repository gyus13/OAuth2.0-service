import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import {JwtModule, JwtService} from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // PassportModule.register({ defaultStrategy: 'jwt', session: false }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),

    TypeOrmModule.forFeature([UserEntity]),

    // forwardRef(() => CatsModule),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtService],
})
export class UserModule {}
