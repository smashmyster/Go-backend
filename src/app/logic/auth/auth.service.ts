import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { user } from '../../entities/user';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
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
    console.log('ww', token);
    const user = await this.usersService.getUserByToken(token);
    console.log('user', user);
    if (!user) {
      return null;
    }
    return user;
  }
}
