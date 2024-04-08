import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { user } from '../../entities/user';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validate(
    username: string,
    password: string,
    expoPushNotificationToken: string,
  ) {

    const user = await this.usersService.validateUserToken(
      username,
      password,
      expoPushNotificationToken,
    );
    if (!user) {
      return null;
    }
    return user;
  }

  async login(user: user): Promise<{ accessToken: string }> {
    const payload = {
      sub: user.id,
    };
    return {
      accessToken: user.loginToken,
    };
  }
}
