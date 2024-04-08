import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from '../../entities/user';
import { Gender } from '../../entities/Gender';
import { UserService } from './user.service';
import { GenderService } from '../gender/gender.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './Constants';

@Module({
  imports: [TypeOrmModule.forFeature([user, Gender])],
  exports: [TypeOrmModule, UserService],
  providers: [UserService, GenderService],
})
export class UserModule {}
