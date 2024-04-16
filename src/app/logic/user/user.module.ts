import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from '../../entities/user';
import { Gender } from '../../entities/Gender';
import { UserService } from './user.service';
import { GenderService } from '../gender/gender.service';
import { jwtConstants } from '../auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { UserPhotos } from '../../entities/user-photos';

@Module({
  imports: [
    TypeOrmModule.forFeature([user, Gender, UserPhotos]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  exports: [TypeOrmModule, UserService],
  providers: [UserService, GenderService],
})
export class UserModule {}
