import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { messages } from '../../entities/messages';
import { messageTypes } from '../../entities/message-type';
import { user } from '../../entities/user';
import { messagesChat } from '../../entities/message-chat';
import { ChatService } from '../chat/chat.service';
import { UserService } from '../user/user.service';
import { GenderService } from '../gender/gender.service';
import { JwtService } from '@nestjs/jwt';
import { UserPhotos } from '../../entities/user-photos';
import { Gender } from '../../entities/gender';

@Module({

  imports: [
    TypeOrmModule.forFeature([messages, messageTypes, user, messagesChat,UserPhotos,Gender]),
  ],
  providers:[Gateway,ChatService,UserService,GenderService,JwtService],
  exports:[ChatService]
})
export class GatewayModule {}
