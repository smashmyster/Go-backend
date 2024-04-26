import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import * as console from 'console';
import { ServerType } from 'typeorm';
import { Subscription } from 'rxjs';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway()
export class Gateway implements  OnGatewayDisconnect, OnGatewayConnection {
  private eventSubscription: Subscription;
  private userToSocketId = {};
  private socketIdToUser = {};

  constructor(
    private readonly chatService: ChatService,
  ) {
  }

  handleConnection(client: any, ...args: any[]) {
    console.log("setting user",client.id);
      client.on('setUserId', (uId:number)=> {
        this.userToSocketId[uId] = client.id;
        this.socketIdToUser[client.id] = uId;
      });
    }

  handleDisconnect(client: any) {
    const socketToId=this.socketIdToUser[client.id]
    delete this.userToSocketId[socketToId]
    delete this.socketIdToUser[client.id]
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('setConnection')
  onNewMessage(@MessageBody() body: any, @ConnectedSocket() client) {
    console.log(client);
    this.server.emit('onMessage', {
      msg: 'New Messsage',
      body,
    });
  }


  afterInit(server: ServerType): void {

    this.eventSubscription = this.chatService.getSocketEmmit$().subscribe({
      next: (event) => this.processMessage(event.name, event.data,event.userId),
      // error: (err) => server.emit('exception', err),
    });
  }

  async processMessage(name: string, data: any,userId:number) {
    console.log(this.userToSocketId);
      const socketId=this.userToSocketId[userId]
      const send= this.server.to(socketId).emit(name,JSON.stringify(data))
    // console.log(send);
  }
}