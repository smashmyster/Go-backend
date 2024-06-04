import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { userSubscriptions } from '../../entities/user-subscriptions';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionService: SubscriptionsService) {}
  @Get('/')
  getAllSubscription() {
    return this.subscriptionService.getAll();
  }
  @UseGuards(JwtAuthGuard)
  @Post('subscribeToSubscription')
  subscribeToSubscription(
    @Request() req,
    @Body() subscriptionData,
  ): Promise<userSubscriptions> {
    return this.subscriptionService.subscribeToSubscription(
      req.user.id,
      subscriptionData.subscriptionId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('updateSubscriptionPayment')
  updateSubscriptionPayment(
    @Request() req,
    @Body() subscriptionData,
  ): Promise<userSubscriptions | null> {
    return this.subscriptionService.updateSubscriptionPayment(
      req.user.id,
      subscriptionData.subscriptionId,
      subscriptionData.paymentApproved,
      subscriptionData?.paymentTraceId,
    );
  }
}
