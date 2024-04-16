import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from '../../entities/user';
import { UserRequests } from '../../entities/user-requests';

@Module({
  imports: [TypeOrmModule.forFeature([UserRequests, user])],
  exports: [TypeOrmModule],
})
export class RequestsModule {}
