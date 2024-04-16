import { Injectable } from '@nestjs/common';
import { messages } from '../../entities/messages';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { messagesChat } from '../../entities/message-chat';
import { messageTypes } from '../../entities/message-type';
import { messageRelations } from './DTO/relations';
import { SendUserMessageDTO } from './DTO/sendUserMessageDTO';
import { GeneralResponse } from '../../../utils/SharedSchema';

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(messages)
    private readonly messagesRepo: Repository<messages>,
    @InjectRepository(messagesChat)
    private readonly messageChatRepo: Repository<messagesChat>,
    @InjectRepository(messageTypes)
    private readonly messageTypeRepo: Repository<messageTypes>,
  ) {}

  async sendMessage(
    data: SendUserMessageDTO,
    senderId,
  ): Promise<messages> {
    const sender = await this.userService.getUserProfileById(senderId);
    const receiver = await this.userService.getUserProfileById(data.receiver);
    const messageType = await this.messageTypeRepo.findOne({
      where: { id: data.messageType },
    });
    const chatLink = await this.getChatLink(senderId, data.receiver);
    const message = data.message;
    const saveUserMessage = {
      sender,
      messageType,
      read: false,
      readAt: null,
      receiver,
      message,
      chatLink,
    };
    const saveMessage = await this.messagesRepo.save(saveUserMessage);
    console.log(saveMessage);
    // const socket=io('http://localhost:3001')
    // socket.on('connect',()=>{
    //   socket.emit('server-message',{sender:sender.id,receiver:receiver.id,messageType,message,read:false,createdOn:saveMessage.createdOn})
    //   socket.disconnect()
    // })
    await this.messageChatRepo.update(
      { id: chatLink.id },
      { lastUpdated: new Date() },
    );
    return saveMessage;
  }

  async getMessages(userChat: number, offset: number): Promise<messages[]> {
    const skip = offset ?? 0;
    const chatLinkData = await this.messageChatRepo.findOne({
      where: { id: userChat },
    });
    const messages = await this.messagesRepo.find({
      order: { id: 'DESC' },
      skip,
      relations: messageRelations,
      where: {
        chatLink: {
          id: chatLinkData.id,
        },
      },
    });
    await this.messagesRepo.update(
      { id: In(messages.map((item) => item.id)) },
      { read: true, readAt: new Date() },
    );
    return messages;
  }

  async getChatLink(
    senderId: number,
    receiverId: number,
  ): Promise<messagesChat> {
    const sender = await this.userService.getUserProfileById(senderId);
    const receiver = await this.userService.getUserProfileById(receiverId);
    const check = await this.messageChatRepo.findOne({
      where: [
        {
          secondUser: { id: senderId },
          firstUser: { id: receiverId },
        },
        {
          secondUser: { id: receiverId },
          firstUser: { id: senderId },
        },
      ],
    });
    if (check) {
      return check;
    }
    return this.messageChatRepo.save({
      firstUser: sender,
      secondUser: receiver,
    });
  }

  async getConversations(offset, userId) {
    const conversations = await this.messageChatRepo.find({
      take: 10,
      order: { id: 'DESC' },
      skip: offset ?? 0,
      where: [
        {
          secondUser: { id: userId },
        },
        {
          firstUser: { id: userId },
        },
      ],
      relations: ['firstUser', 'secondUser'],
    });
    const messaging = [];
    for (const conversation of conversations) {
      const lastMessage = await this.messagesRepo.findOne({
        where: {
          chatLink: { id: conversation.id },
        },
        order: { id: 'DESC' },

        relations: messageRelations,
      });

      if (conversation.secondUser.id == userId) {
        messaging.push({
          ...conversation.firstUser,
          lastUpdated: conversation.lastUpdated,
          lastMessage,
          conversationId: conversation.id,
        });
      } else {
        messaging.push({
          ...conversation.secondUser,
          lastUpdated: conversation.lastUpdated,
          lastMessage,
          conversationId: conversation.id,
        });
      }
    }
    return messaging;
  }

  async deleteConversation(conversationId, userId) {
    const conversation = await this.messageChatRepo.findOne({
      where: {
        id: conversationId,
      },
      relations: ['firstUser', 'secondUser'],
    });

    if (conversation) {
      if (
        conversation.secondUser.id == userId ||
        conversation.firstUser.id == userId
      ) {
        await this.messagesRepo.delete({ chatLink: { id: conversation.id } });
        await this.messageChatRepo.delete({ id: conversationId });
      }
    }
    return {
      success: true,
      message: 'Updated',
    };
  }
}
