import { Controller, Post, UseGuards, Request, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GeneralResponse } from '../../../utils/SharedSchema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return { accessToken: req.user.loginToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verifyToken')
  async verifyToken(@Request() req) {
    return {
      success: true,
      message: 'Valid token',
    };
  }
  @Post('loginWithPhone')
  async loginWithPhone(@Body()body):Promise<GeneralResponse>{
    return  this.authService.loginWithPhone(body.phoneNumber)
  }
  @Post('verifyUserLoginCode')
  verifyUserCode(
    @Body() body: { code: string,phoneNumber:string },
  ): Promise<GeneralResponse> {
    return this.authService.verifyUserLoginCode(body.phoneNumber, body.code);
  }
}
