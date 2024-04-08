import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { user } from '../../../entities/user';
import { GeneralResponse } from '../../../../Utils/SharedSchema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
    expoPushNotificationToken: string,
  ): Promise<user | GeneralResponse> {
    const userData = await this.authService.validate(username, password,expoPushNotificationToken);

    if (!userData || !userData.hasOwnProperty('id')) {
      throw new UnauthorizedException();
    }
    return userData;
  }
}
