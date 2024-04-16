import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { user } from '../../entities/user';
import { SignUpCheckCredentialsDTO, SignUpDTO } from './dto/SignUpDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeneralResponse } from '../../../utils/SharedSchema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { userUpdateDetails } from '../../../utils/Utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  signupUser(@Body() data: SignUpDTO): Promise<user | GeneralResponse> {
    return this.userService.signUpUser(data);
  }

  @Post('PhoneNumberSend')
  phoneNumberSend(
    @Body() body: { phoneNumber: string },
  ): Promise<GeneralResponse> {
    return this.userService.createUserPhone(body.phoneNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verifyUserCode')
  verifyUserCode(
    @Body() body: { code: string },
    @Request() req,
  ): Promise<GeneralResponse> {
    return this.userService.verifyUserCode(req.user.id, body.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateUserDetails')
  updateUserDetails(
    @Body() body: { value: string; field: userUpdateDetails },
    @Request() req,
  ): Promise<GeneralResponse> {
    switch (body.field) {
      case userUpdateDetails.Name:
        return this.userService.updateUserName(req.user.id, body.value);

      case userUpdateDetails.DOB:
        return this.userService.updateDOB(req.user.id, body.value);
      case userUpdateDetails.Email:
        return this.userService.updateEmail(req.user.id, body.value);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUsers')
  getUsers(@Request() req): Promise<user[]> {
    return this.userService.getUsers(req.user.id);
  }

  @Post('checkCredential')
  checkCredentials(
    @Body() data: SignUpCheckCredentialsDTO,
  ): Promise<GeneralResponse> {
    return this.userService.checkCredential(data);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getMyProfile')
  getMyProfile(
    @Request() req,
  ): Promise<user> {
    console.log(req.user);
    return this.userService.getUserProfileById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('uploadUserImage')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() body,
  ) {
    console.log(body);
    const fullPath = `${process.env.hostResolver}${file.originalname}`;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    fs.rename(
      file.path,
      file.path.replace(file.filename, file.originalname),
      async () => {
        await this.userService.updateUserImages(
          fullPath,
          req.user.id,
          body.order,
        );
      },
    );
    return {
      success: true,
      message: fullPath,
    };
  }
}
