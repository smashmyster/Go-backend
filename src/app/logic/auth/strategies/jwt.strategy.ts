import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import e from 'express';
import { AuthService } from '../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async authenticate(req: e.Request) {
    if (!req.headers.authorization) this.fail(401);
    const user = await this.authService.verify(
      req.headers.authorization.replace('Bearer ', ''),
    );
    if (user) {
      this.success(user);
    } else {
      this.fail(401);
    }
  }
}
