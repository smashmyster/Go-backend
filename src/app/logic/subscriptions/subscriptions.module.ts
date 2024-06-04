import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { subscriptions } from '../../entities/subscriptions';
import { user } from '../../entities/user';
import { userSubscriptions } from '../../entities/user-subscriptions';

@Module({
  imports: [TypeOrmModule.forFeature([subscriptions, user, userSubscriptions])],
  exports: [TypeOrmModule],
})
export class SubscriptionsModule {}
