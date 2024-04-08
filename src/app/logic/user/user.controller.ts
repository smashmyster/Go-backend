import {
  Body,
  Controller,
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  loginUser(
    @Body()
    data: {
      username: string;
      password: string;
      expoPushNotification?: string;
    },
  ) {
    return this.userService.login(
      data.username,
      data.password,
      data.expoPushNotification,
    );
  }
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
  @Post('checkCredential')
  checkCredentials(
    @Body() data: SignUpCheckCredentialsDTO,
  ): Promise<GeneralResponse> {
    return this.userService.checkCredential(data);
  }

  @Post('uploadProfileImage')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const fullPath = `${process.env.hostResolver}${file.originalname}`;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    fs.rename(
      file.path,
      file.path.replace(file.filename, file.originalname),
      async () => {
        await this.userService.updateUser('coverImage', fullPath, req.user.id);
      },
    );
    return {
      success: true,
      message: fullPath,
    };
  }
}
