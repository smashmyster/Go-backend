import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { messages } from '../../entities/messages';
import { messageTypes } from '../../entities/message-type';
import { user } from '../../entities/user';
import { messagesChat } from '../../entities/message-chat';

@Module({
  imports: [
    TypeOrmModule.forFeature([messages, messageTypes, user, messagesChat]),
  ],
  exports: [TypeOrmModule],
})
export class ChatModule {}
