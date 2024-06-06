import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequestUserDTO } from './DTO/FollowUserDTO';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestsService } from './requests.service';
import { UserRequests } from '../../entities/user-requests';
import { GeneralResponse } from '../../../utils/SharedSchema';

@Controller('requesting')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('requestUser')
  followUser(
    @Body() requestData: RequestUserDTO,
    @Request() req,
  ): Promise<GeneralResponse> {
    return this.requestsService.requestUser(requestData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('isFollowingUser/:userId')
  isFollowingUser(
    @Param('userId') userId,
    @Request() req,
  ): Promise<GeneralResponse> {
    return this.requestsService.requestIsValid(req.user.id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllRequests')
  getRequests(@Request() req): Promise<UserRequests[]> {
    return this.requestsService.getAllRequests(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getSentRequests')
  geMyFollowers(@Request() req): Promise<UserRequests[]> {
    return this.requestsService.getSentRequests(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getReceivedRequests')
  getReceivedRequests(@Request() req): Promise<UserRequests[]> {
    return this.requestsService.getReceivedRequests(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getRequest/:requestId')
  getRequest(
    @Request() req,
    @Param('requestId') requestId,
  ): Promise<UserRequests | GeneralResponse> {
    return this.requestsService.getRequest(requestId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getRequestToUser/:userId')
  getRequestToUser(
    @Request() req,
    @Param('userId') userId,
  ): Promise<UserRequests | GeneralResponse> {
    return this.requestsService.getRequestToUser(userId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('respondToRequest')
  acceptRequest(
    @Request() req,
    @Body() requestData,
  ): Promise<UserRequests | GeneralResponse> {
    return this.requestsService.respondToRequest(
      requestData.requestId,
      req.user.id,
      requestData.decision,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('updatePayment')
  updatePayment(
    @Request() req,
    @Body() requestData,
  ): Promise<UserRequests | GeneralResponse> {
    return this.requestsService.updatePayment(
      requestData.requestId,
      req.user.id,
      requestData.decision,
      requestData.coinsUsed,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('startMeetup')
  startMeetup(
    @Request() req,
    @Body() requestData,
  ): Promise<UserRequests | GeneralResponse> {
    return this.requestsService.startMeetup(requestData.requestId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('endMeetup')
  endMeetup(
    @Request() req,
    @Body() requestData,
  ): Promise<UserRequests | GeneralResponse> {
    return this.requestsService.endMeetup(requestData.requestId);
  }
}
