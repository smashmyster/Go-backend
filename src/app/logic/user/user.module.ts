import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from '../../entities/user';
import { UserService } from './user.service';
import { GenderService } from '../gender/gender.service';
import { jwtConstants } from '../auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { UserPhotos } from '../../entities/user-photos';
import { Gender } from '../../entities/gender';
import { UserRequests } from '../../entities/user-requests';
import { RequestsService } from '../requests/requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([user, Gender, UserPhotos,UserRequests]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  exports: [TypeOrmModule, UserService],
  providers: [UserService, GenderService,RequestsService],
})
export class UserModule {}
