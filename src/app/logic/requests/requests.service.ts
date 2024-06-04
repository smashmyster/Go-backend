import { Injectable } from '@nestjs/common';
import { RequestUserDTO } from './DTO/FollowUserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from '../../entities/user';
import { Repository } from 'typeorm';
import { UserRequests } from '../../entities/user-requests';
import { GeneralResponse } from '../../../utils/SharedSchema';
// import { sendSingleNotification } from 'src/app/notifications/Notifications';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(user)
    private readonly userRepo: Repository<user>,
    @InjectRepository(UserRequests)
    private readonly requestRepo: Repository<UserRequests>,
  ) {}

  async requestUser(
    user: RequestUserDTO,
    requester: number,
  ): Promise<GeneralResponse> {
    const checkIfRequested = await this.requestIsValid(user.userId, requester);
    if (checkIfRequested) {
      if (
        checkIfRequested.success == false &&
        checkIfRequested.extraData?.active == true
      ) {
        {
          return {
            success: false,
            message: 'User already requested ',
          };
        }
      } else if (
        checkIfRequested.success == true &&
        checkIfRequested.extraData?.active == false
      ) {
        return {
          success: true,
          message: 'User Requested ',
        };
      }
    }

    const userObject = await this.userRepo.findOne({
      where: { id: user.userId },
    });
    const requesterObject = await this.userRepo.findOne({
      where: { id: requester },
    });

    const request = await this.requestRepo.save({
      userReceivingRequest: userObject,
      userRequesting: requesterObject,
      accepted: false,
      paid: false,
      location: requesterObject.location,
      latlong: user.latlong,
      meetUpDate: user.meetupDate,
      active: true,
      price: user.coinsBid,
      address: user.address,
    });
    // sendSingleNotification(`You received a request from ${requesterObject.username}`,request,userObject.expoPushNotificationToken)
    await this.userRepo.update(
      { id: userObject.id },
      { numberOfRequests: userObject.numberOfRequests + 1 },
    );
    return {
      success: true,
      message: 'Requested',
      extraData: request,
    };
  }

  async requestIsValid(
    user: number,
    requester: number,
  ): Promise<GeneralResponse> {
    const check = await this.requestRepo.findOne({
      where: {
        userRequesting: { id: requester },
        userReceivingRequest: { id: user },
        active: true,
      },
    });
    if (check && check.accepted) {
      return {
        success: true,
        message: check.accepted == true ? 'Accepted' : 'Requesting',
        extraData: check,
      };
    } else {
      return {
        success: false,
        message: 'Follow',
        extraData: check ?? {},
      };
    }
  }

  async getAllRequests(userId: number) {
    return this.requestRepo.find({
      where: [
        {
          userRequesting: { id: userId },
        },
        {
          userReceivingRequest: { id: userId },
        },
      ],
      relations: {
        userRequesting: {
          photos: true,
        },
        userReceivingRequest: {
          photos: true,
        },
      },
    });
  }

  async getSentRequests(userId: number) {
    return this.requestRepo.find({
      where: {
        userRequesting: { id: userId },
        active: true,
      },
      relations: ['userReceivingRequest'],
    });
  }

  async getReceivedRequests(userId: number) {
    return this.requestRepo.find({
      where: {
        userRequesting: { id: userId },
        accepted: false,
      },
      relations: ['userRequesting'],
    });
  }
  async respondToRequest(
    requestId: number,
    userId: number,
    decision: boolean,
  ): Promise<GeneralResponse> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: { userRequesting: true, userReceivingRequest: true },
    });

    if (userId != request.userReceivingRequest.id) {
      return {
        success: false,
        message: 'You have no access to this request',
      };
    }
    const updateParam = {
      active: request.active,
      rejected: request.rejected,
      accepted: request.accepted,
    };
    switch (decision) {
      case true:
        updateParam.accepted = true;
        updateParam.active = true;
        updateParam.rejected = false;
        break;
      case false:
        (updateParam.active = false), (updateParam.rejected = true);
        updateParam.accepted = false;
        break;
    }
    await this.requestRepo.update({ id: request.id }, updateParam);
    return {
      success: true,
      extraData: updateParam,
      message: 'Updated',
    };
  }
  async getRequest(requestId: number, userId: number) {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: { userRequesting: true, userReceivingRequest: true },
    });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user.id != request.userReceivingRequest.id) {
      return {
        success: false,
        message: 'You have no access to this request',
      };
    }
    return request;
  }

  async getRequestToUser(userId: number, requesterId: number) {
    const request = await this.requestRepo.findOne({
      where: [
        {
          userRequesting: { id: requesterId },
          userReceivingRequest: { id: userId },
          active: true,
        },
        {
          userReceivingRequest: { id: requesterId },
          userRequesting: { id: userId },
          active: true,
        },
      ],
      order: { id: 'DESC' },
      relations: ['userRequesting', 'userReceivingRequest'],
    });

    if (!request) {
      return {
        success: false,
        message: 'There is no request',
      };
    }

    return request;
  }
  async updatePayment(
    requestId: any,
    userId: any,
    decision: any,
    coinsUsed: number = 0,
  ): Promise<GeneralResponse | UserRequests> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: { userRequesting: true, userReceivingRequest: true },
    });
    const user = await this.userRepo.findOne({
      where: { id: request.userRequesting.id },
    });
    await this.userRepo.update(
      { id: user.id },
      { walletBalance: user.walletBalance - coinsUsed },
    );
    if (
      request.userRequesting.id == userId ||
      request.userReceivingRequest.id == userId
    ) {
      await this.requestRepo.update({ id: requestId }, { paid: decision });
      return {
        success: true,
        message: 'Request paid',
      };
    } else {
      return {
        success: false,
        message: 'You do not have access ti this request',
      };
    }
  }
  async startMeetup(requestId: any): Promise<GeneralResponse | UserRequests> {
    await this.requestRepo.findOne({
      where: { id: requestId },
      relations: { userRequesting: true, userReceivingRequest: true },
    });
    await this.requestRepo.update(
      { id: requestId },
      { startDate: true, startTime: new Date() },
    );
    return {
      success: true,
      message: 'Updated',
    };
  }
  async endMeetup(requestId: any): Promise<GeneralResponse | UserRequests> {
    await this.requestRepo.findOne({
      where: { id: requestId },
      relations: { userRequesting: true, userReceivingRequest: true },
    });
    await this.requestRepo.update(
      { id: requestId },
      { startDate: false, endTime: new Date(), completed: true, active: false },
    );
    return {
      success: true,
      message: 'Updated',
    };
  }
}
