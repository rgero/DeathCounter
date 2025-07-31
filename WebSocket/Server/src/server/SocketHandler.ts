import { Server, Socket } from 'socket.io';
import { decryptField, encryptField } from '../utils/crypt';

import { MessageSchema } from "../schemas/Message";
import { WsMessage } from "../interfaces/WsMessage";
import { decrypt } from 'dotenv';

export class SocketHandler {
  private io: Server | undefined;
  
  initialize(io: Server) {
    this.io = io;
    
    console.log('Socket.IO server initialized.');
    
    this.io.engine.on("connection_error", (err) => {
      console.log("Engine connection error:", err);
    });
    
    this.io.on('connection', (socket) => this.onSocketConnected(socket));
  }

  private onSocketConnected(socket: Socket) {
    console.log(`Socket connected: ${socket.id}`);
    
    // Listen for specific events - authentication happens per message
    socket.on('bossDeathIncrement', (data) => this.onSocketMessage(socket, { event: 'bossDeathIncrement', ...data }));
    socket.on('bossDefeated', (data) => this.onSocketMessage(socket, { event: 'bossDefeated', ...data }));
    socket.on('genericDeathIncrement', (data) => this.onSocketMessage(socket, { event: 'genericDeathIncrement', ...data }));
    socket.on('message', (data) => this.onSocketMessage(socket, { event: 'message', ...data }));
    
    socket.on('disconnect', (reason) => this.onSocketDisconnected(socket, reason));
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  }
  
  onSocketMessage(socket: Socket, data: any): void {
    console.log(`Received message from ${socket.id}:`, data);

    try {
      const message: WsMessage = MessageSchema.parse(data) as WsMessage;
      const correctAuthToken = decryptField(message.authToken);

      if (correctAuthToken !== message.gameToken) {
        console.log("Not correct token");
        return;
      }

      this.broadcastToAll(message);
    }
    catch (error) {
      console.error("Error parsing message:", error);
      socket.emit('error', { message: 'Invalid message format' });
    }
  }

  onSocketDisconnected(socket: Socket, reason: string) {
    console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
  }

  private broadcastToAll(message: WsMessage) {
    console.log(message);
    if (this.io) {
      this.io.emit(message.event, message);
    }
  }
}