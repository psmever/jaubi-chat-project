import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { randomUUID } from 'node:crypto';
import { Server, Socket } from 'socket.io';
import {
  MessageReadPayload,
  MessageSendPayload,
  RoomJoinPayload,
  RoomLeavePayload,
  SocketEvents,
  TypingPayload
} from '@jaubi-chat/api-contract';

@WebSocketGateway({
  cors: {
    origin: process.env.BACKEND_CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true
  }
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Server;

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      client.disconnect(true);
      return;
    }
  }

  handleDisconnect(_client: Socket) {}

  @SubscribeMessage(SocketEvents.RoomJoin)
  handleRoomJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: RoomJoinPayload) {
    void client.join(payload.roomId);
  }

  @SubscribeMessage(SocketEvents.RoomLeave)
  handleRoomLeave(@ConnectedSocket() client: Socket, @MessageBody() payload: RoomLeavePayload) {
    void client.leave(payload.roomId);
  }

  @SubscribeMessage(SocketEvents.MessageSend)
  handleMessageSend(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageSendPayload) {
    const createdMessage = {
      id: randomUUID(),
      roomId: payload.roomId,
      senderId: client.id,
      content: payload.content,
      createdAt: new Date().toISOString(),
      clientMessageId: payload.clientMessageId
    };

    this.server.to(payload.roomId).emit(SocketEvents.MessageCreated, createdMessage);
  }

  @SubscribeMessage(SocketEvents.MessageRead)
  handleMessageRead(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageReadPayload) {
    client.to(payload.roomId).emit(SocketEvents.MessageRead, payload);
  }

  @SubscribeMessage(SocketEvents.TypingStart)
  handleTypingStart(@ConnectedSocket() client: Socket, @MessageBody() payload: TypingPayload) {
    client.to(payload.roomId).emit(SocketEvents.TypingStart, payload);
  }

  @SubscribeMessage(SocketEvents.TypingStop)
  handleTypingStop(@ConnectedSocket() client: Socket, @MessageBody() payload: TypingPayload) {
    client.to(payload.roomId).emit(SocketEvents.TypingStop, payload);
  }
}
