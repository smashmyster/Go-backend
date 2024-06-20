import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from '../../entities/user';
import { In, Not, Repository } from 'typeorm';
import { SignUpCheckCredentialsDTO, SignUpDTO } from './dto/SignUpDTO';
import { GenderService } from '../gender/gender.service';
import { GeneralResponse } from '../../../utils/SharedSchema';
import { generateOTP } from '../../../utils/Utils';
import { jwtConstants } from '../auth/constants';
import { JwtService } from '@nestjs/jwt';
import { UserPhotos } from '../../entities/user-photos';
import * as process from 'process';
import { RequestsService } from '../requests/requests.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(user)
    private readonly userRepo: Repository<user>,
    private readonly genderService: GenderService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserPhotos)
    private readonly imageRepo: Repository<UserPhotos>,
    private readonly requestService:RequestsService
  ) {}

  async getUserProfileById(id): Promise<user> {
    const data = await this.userRepo.findOne({
      where: { id },
      relations: {
        photos: true,
        subscriptions: {
          subscription: true,
        }
      },
    });
    data.subscriptions=data.subscriptions.filter(item => item.active == true)
    return data;
  }

  async login(
    username: string,
    password: string,
  ): Promise<user | GeneralResponse> {
    const user = await this.userRepo.findOne({
      where: [
        {
          phoneNumber: username,
          password: password,
        },
        {
          email: username,
          password: password,
        },
      ],
    });
    if (user) {
      const loginToken = await this.processToken(user);
      await this.userRepo.update(
        { id: user.id },
        {
          loginToken: loginToken?.access_token,
        },
      );

      const loggedInUser = await this.getUserProfileById(user.id);
      loggedInUser.loginToken = loginToken.access_token;
      return loggedInUser;
    } else {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }
  }

  async processToken(user: user) {
    return {
      access_token: this.jwtService.sign({ sub: user.id }, jwtConstants),
    };
  }

  async signUpUser(data: SignUpDTO): Promise<user | GeneralResponse> {
    const checkPhone = await this.userRepo.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });
    if (checkPhone) {
      return {
        success: false,
        message: `Phone number in use`,
      };
    }
    const checkEmail = await this.userRepo.findOne({
      where: {
        email: data.email,
      },
    });
    if (checkEmail) {
      return {
        success: false,
        message: `Email number in use`,
      };
    }
    const gender = await this.genderService.getOne(data.genderValue);
    const userDetails = await this.userRepo.save({
      ...data,
      gender,
      coins: 0,
      credits: 0,
      walletBalance: 0,
    });
    const accessToken = await this.processToken(userDetails);
    await this.userRepo.update(
      { id: userDetails.id },
      { loginToken: accessToken.access_token },
    );
    return this.userRepo.findOne({ where: { id: userDetails.id } });
  }

  async updateUser(
    field: string,
    value: string,
    userId,
  ): Promise<GeneralResponse> {
    await this.userRepo.update({ id: userId }, { [field]: value });
    return {
      success: true,
      message: 'Updated',
    };
  }

  async getUserByToken(token): Promise<null | user> {
    return this.userRepo.findOne({
      where: {
        loginToken: token,
      },
    });
  }

  async validateUserToken(
    username: string,
    password: string,
  ): Promise<user | GeneralResponse> {
    return await this.login(username, password);
  }

  async checkCredential(data: SignUpCheckCredentialsDTO) {
    if (data.phoneNumber) {
      const checkPhone = await this.userRepo.findOne({
        where: {
          phoneNumber: data.phoneNumber,
        },
      });
      if (checkPhone) {
        return {
          success: false,
          message: `Phone number in use`,
        };
      }
    }
    if (data.email) {
      const checkEmail = await this.userRepo.findOne({
        where: {
          email: data.email,
        },
      });
      if (checkEmail) {
        return {
          success: false,
          message: `Email number in use`,
        };
      }
    }
    return {
      success: true,
      message: 'No duplicates',
    };
  }

  async getUsersWithParameters(parameters) {
    return this.userRepo.find(parameters);
  }

  async getUserWithParameters(parameters) {
    return this.userRepo.findOne({ where: parameters });
  }

  getUserByEmailOrPhone(params: string) {
    return this.userRepo.findOne({ where: { email: params } });
  }
  getUserByPhone(phoneNumber:string):Promise<user>{
    return  this.userRepo.findOne({where:{phoneNumber}})
  }
  async createUserPhone(phoneNumber: string) {
    const checkPhone = await this.userRepo.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });
    if (checkPhone) {
      return {
        success: false,
        message: `Phone number in use`,
      };
    }
    const otp = generateOTP();
    const user = await this.userRepo.save({ phoneNumber, otp });
    const token = await this.processToken(user);
    await this.userRepo.update(
      { id: user.id },
      { loginToken: token.access_token },
    );
    return {
      success: true,
      message: token.access_token,
    };
  }

  async verifyUserCode(userId: number, code: string): Promise<GeneralResponse> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      if (user.otp == code.toString()) {
        await this.userRepo.update({ id: userId }, { otp: '', verified: true });
      } else {
        return {
          success: false,
          message: 'Wrong otp',
        };
      }
    }
    return {
      success: true,
      message: 'Otp Updated',
    };
  }

  async updateUserName(userId: number, name: string): Promise<GeneralResponse> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      await this.userRepo.update({ id: userId }, { name });
    }
    return {
      success: true,
      message: 'Name Updated',
    };
  }
  async updateUserGender(
    userId: number,
    genderId: string,
  ): Promise<GeneralResponse> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const gender = await this.genderService.getOne(genderId);
    if (user) {
      await this.userRepo.update({ id: userId }, { gender: gender });
    }
    return {
      success: true,
      message: 'Name Updated',
    };
  }
  async updateUserInterestedGender(
    userId: number,
    genderId: string,
  ): Promise<GeneralResponse> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const gender = await this.genderService.getOne(genderId);
    if (user) {
      await this.userRepo.update({ id: userId }, { genderInterested: gender });
    }
    return {
      success: true,
      message: 'Name Updated',
    };
  }async updateWalletTopUp(
    userId: number,
    amount: string,
  ): Promise<GeneralResponse> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      const walletBalance=user?.walletBalance?user.walletBalance+parseFloat(amount):parseFloat(amount)

      await this.userRepo.update({ id: userId }, { walletBalance });
    }
    return {
      success: true,
      message: 'Balance Updated',
    };
  }

  async updateDOB(userId: number, date: string): Promise<GeneralResponse> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      await this.userRepo.update({ id: userId }, { DOB: new Date(date) });
    }
    return {
      success: true,
      message: 'DOB Updated',
    };
  }

  async updateEmail(userId: number, value: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const emailLookUp = await this.userRepo.findOne({
      where: { email: value },
    });
    if (emailLookUp) {
      if (user.id == emailLookUp.id) {
        await this.userRepo.update({ id: userId }, { email: value });
      } else {
        return {
          success: false,
          message: 'Email in use',
        };
      }
    } else {
      await this.userRepo.update({ id: userId }, { email: value });
    }
    return {
      success: true,
      message: 'Email Updated',
    };
  }
  async updateFee(userId: number, value: number) {
    await this.userRepo.update({ id: userId }, { fee: value });
    return {
      success: true,
      message: 'Fee Updated',
    };
  }

  async updateUserImages(fullPath: string, userId: number, order: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const photoEntry = await this.imageRepo.findOne({
      where: {
        user,
        order,
      },
    });
    if (photoEntry) {
      await this.imageRepo.update({ id: photoEntry.id }, { image: fullPath });
      if (user.coverImage == photoEntry.image) {
        await this.userRepo.update({ id: userId }, { coverImage: fullPath });
      }
    } else {
      const photoSave = await this.imageRepo.save({
        image: fullPath,
        user,
        order,
      });
      if (user.coverImage == null || user.coverImage == '') {
        await this.userRepo.update({ id: userId }, { coverImage: fullPath });
      } else {
        const photoLinked = await this.imageRepo.findOne({
          where: { image: user.coverImage },
        });
        if (photoLinked && photoSave.order < photoLinked.order) {
          await this.userRepo.update({ id: userId }, { coverImage: fullPath });
        }
      }
    }
  }

  async getUsers(userId: number): Promise<user[]> {
    const requesters = [userId];
    const sentRequests=await  this.requestService.getAllRequests(userId)
    console.log(sentRequests);
    const data=sentRequests.map(item=>{
      if(item.completed){
        return
      }
      if(item.userRequesting.id==userId){
        requesters.push(item.userReceivingRequest.id)
      }else{
        requesters.push(item.userRequesting.id)
      }
    })
    const usersGet = await this.userRepo.find({
      relations: {
        photos: true,
      },
      where: {
        id: Not(In(requesters)),
        active:true,

      },
    });
    return usersGet;
  }

  async updatePhoneNumber(userId, value: string) {
    await this.userRepo.update({ id: userId }, { phoneNumber: value });
    return {
      success: true,
      message: 'Fee Updated',
    };
  }

  async updateUserBio(userId, value: string) {
    await this.userRepo.update({ id: userId }, { bio: value });
    return {
      success: true,
      message: 'Fee Updated',
    };
  }

  async updateUserActive(userId, valueReceived: string) {
    const value=valueReceived=="true"
    await this.userRepo.update({ id: userId }, { active: value });
    return {
      success: true,
      message: 'Fee Updated',
    };  }
}
