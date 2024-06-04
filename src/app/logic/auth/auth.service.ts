import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { user } from '../../entities/user';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { GeneralResponse } from '../../../utils/SharedSchema';
import { generateOTP } from '../../../utils/Utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(user)
    private readonly userRepo:Repository<user>
  ) {}

  async validate(username: string, password: string) {
    const user = await this.usersService.validateUserToken(username, password);
    if (!user) {
      return null;
    }
    return user;
  }

  async login(user: user) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, jwtConstants),
    };
  }

  async verify(token: string): Promise<user> | null {
    // const decodedToken = await this.jwtService
    //   .verifyAsync(token, {
    //     secret: jwtConstants.secret,
    //   })
    //   .catch((error) => {});
    // console.log(decodedToken);
    // if (!decodedToken) {
    //   return null;
    // }'
    const user = await this.usersService.getUserByToken(token);
    if (!user) {
      return null;
    }
    return user;
  }

  async loginWithPhone(phoneNumber:string):Promise<GeneralResponse> {
    const user=await this.usersService.getUserByPhone(phoneNumber)
    if(user){
      const otp = generateOTP();
      await this.userRepo.update(
        { id: user.id },
        { otp},
      );
      return  {
        success:true,
        message:"Code created"
      }
    }else{
      return {
        success:false,
        message:"Phone number does not exist"
      }
    }
  }

  async verifyUserLoginCode(phoneNumber: string, code: string) {
    const user = await this.usersService.getUserByPhone(phoneNumber);
    if (user) {
      if (user.otp == code.toString()) {
        const loginToken=await  this.login(user)
        await this.userRepo.update({ id: user.id }, { otp: '',loginToken:loginToken.access_token });
        return  {
          success:true,
          message:loginToken.access_token
        }

      } else {
        return {
          success: false,
          message: 'Wrong otp',
        };
      }
    }else{
      return {
        success: false,
        message: 'Please stop hacking this endpoint it wont end well',
      };
    }
  }
}
