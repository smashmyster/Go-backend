import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { subscriptions } from '../../entities/subscriptions';
import { userSubscriptions } from '../../entities/user-subscriptions';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(subscriptions)
    private readonly subscriptionsRepo: Repository<subscriptions>,
    @InjectRepository(userSubscriptions)
    private readonly userSubscriptions: Repository<userSubscriptions>,
    private readonly userService: UserService,
  ) {}
  getAll() {
    return this.subscriptionsRepo.find();
  }
  async getUserSubscriptions(userId: number) {
    const user = await this.userService.getUserProfileById(userId);
    return this.userSubscriptions.find({
      where: {
        userSubscribing: user,
      },
    });
  }

  async subscribeToSubscription(userId: number, subscriptionId: number) {
    const subscription = await this.subscriptionsRepo.findOne({
      where: { id: subscriptionId },
    });
    const user = await this.userService.getUserProfileById(userId);
    const checkSubscription = await this.userSubscriptions.findOne({
      where: {
        userSubscribing: user,
        subscription: subscription,
        active: true,
      },
    });
    const date = new Date();
    date.setDate(date.getDate() + 30);
    if (checkSubscription) {
      return checkSubscription;
    } else {
      return await this.userSubscriptions.save({
        subscription,
        userSubscribing: user,
        active: null,
        endDate: date,
        paid: null,
      });
    }
  }

  async updateSubscriptionPayment(
    userId: number,
    subscriptionId: number,
    paymentApproved: boolean,
    paymentTraceId: string,
  ) {
    const userSubscription = await this.userSubscriptions.findOne({
      where: { id: subscriptionId, active: null },
    });
    if (userSubscription) {
      await this.userSubscriptions.update(
        { id: subscriptionId },
        { paid: paymentApproved, active: paymentApproved, paymentTraceId,paymentDate:new Date() },
      );
      if (paymentApproved) {
        return this.userSubscriptions.findOne({
          where: { id: subscriptionId },
        });
      }
      return null;
    } else {
      return null;
    }
  }
}
