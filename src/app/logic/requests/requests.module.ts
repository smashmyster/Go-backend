import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from '../../entities/user';
import { UserRequests } from '../../entities/user-requests';
import { UserService } from '../user/user.service';
import { GenderService } from '../gender/gender.service';
import { RequestsService } from './requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRequests, user])],
  exports: [TypeOrmModule,RequestsService],
  providers: [RequestsService],
})
export class RequestsModule {}
