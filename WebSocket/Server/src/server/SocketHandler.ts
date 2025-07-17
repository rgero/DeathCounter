import { IncomingMessage, Server } from 'http';
import { RawData, ServerOptions, WebSocket, WebSocketServer } from "ws";

import { MessageSchema } from "../schemas/Message";
import { WsMessage } from "../interfaces/WsMessage";

export class SocketHandler {
  private server: WebSocketServer | undefined;
  private connectedSockets: Set<WebSocket> = new Set();
  
  initialize(options: ServerOptions)
  {
    this.server = new WebSocketServer(options)
    this.server.on('listening', () => console.log(`WebSocket server initialized.`))
    this.server.on('connection', (socket, request) => this.onSocketConnected(socket, request))
  }

  private onSocketConnected(socket: WebSocket, request: IncomingMessage) {
    console.log(`Socket connected from:`, request.socket.remoteAddress);
    this.connectedSockets.add(socket);

    console.log(`Total connected sockets: ${this.connectedSockets.size}`);
    socket.on('message', (data) => this.onSocketMessage(socket, data))
    socket.on('close', ((code, reason) => this.onSocketClosed(socket, code, reason)))
  }
  
  onSocketMessage(socket: WebSocket, data: RawData): void {
    console.log(`Received message: ${data.toString()}`);

    try {
      const messageJSON = JSON.parse(data.toString());
      const message: WsMessage = MessageSchema.parse(messageJSON) as WsMessage;

      switch(message.event) {
        case 'bossDeathIncrement':
          socket.send(JSON.stringify({ event: 'ack', message: 'Boss death increment received' }));
          break;
        case 'genericDeathIncrement':
          socket.send(JSON.stringify({ event: 'ack', message: 'Generic death increment received' }));
          break;
        default:
          // Handle 'message' event - broadcast to all connected sockets
          this.broadcastToAll({ event: 'message', payload: message.payload });
          return;
      }
    }
    catch (error) {
      console.error("Error parsing message:", error);
      socket.send(JSON.stringify({ event: 'error', message: 'Invalid message format' }));
      return;
    }
  }

  onSocketClosed(socket: WebSocket, code: number, reason: Buffer) {
    console.log(`Client has disconnected; code=${code}, reason=${reason}`)
    this.connectedSockets.delete(socket);
  }

  private broadcastToAll(message: any) {
    const messageString = JSON.stringify(message);
    this.connectedSockets.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageString);
      }
    });
  }
}