import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendUserMessageDTO } from './DTO/sendUserMessageDTO';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatServiceService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  sendUserMessage(@Body() data: SendUserMessageDTO, @Request() req) {
    return this.chatServiceService.sendMessage(data, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMessages/:userChat/:offset')
  getUserMessages(
    @Param('userChat') userChat: number,
    @Param('offset') offset: number,
  ) {
    return this.chatServiceService.getMessages(userChat, offset);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMessageChat/:userId')
  getUserMessageChat(@Param('userId') userId: number, @Request() req) {
    return this.chatServiceService.getChatLink(userId, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getConversation/:offset')
  getConversations(@Param('offset') offset, @Request() req) {
    return this.chatServiceService.getConversations(offset, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteConversation/:id')
  deleteConversation(@Param('id') id, @Request() req) {
    return this.chatServiceService.deleteConversation(id, req.user.id);
  }
}
