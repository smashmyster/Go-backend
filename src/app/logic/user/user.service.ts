import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from '../../entities/user';
import { Repository } from 'typeorm';
import { SignUpCheckCredentialsDTO, SignUpDTO } from './dto/SignUpDTO';
import { GenderService } from '../gender/gender.service';
import { GeneralResponse } from '../../../utils/SharedSchema';
import { generateOTP } from '../../../utils/Utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(user)
    private readonly userRepo: Repository<user>,
    private readonly genderService: GenderService,
  ) {}

  async getUserProfileById(id): Promise<user> {
    const data = await this.userRepo.findOne({ where: { id } });
    return data;
  }

  async login(
    username: string,
    password: string,
    expoPushNotificationToken: string,
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
          expoPushNotificationToken: expoPushNotificationToken ?? '',
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
      access_token: '',
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
    expoPushNotificationToken: string,
  ): Promise<user | GeneralResponse> {
    return await this.login(username, password, expoPushNotificationToken);
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
    await this.userRepo.save({ phoneNumber, otp });
    return {
      success: true,
      message: 'OTP',
    };
  }
}
