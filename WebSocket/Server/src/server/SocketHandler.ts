import { RawData, ServerOptions, WebSocket, WebSocketServer } from "ws";

import { IncomingMessage } from 'http';

export class SocketHandler {
  private server: WebSocketServer | undefined;
  
  initialize(options: ServerOptions)
  {
    this.server = new WebSocketServer(options)
    
    this.server.on('listening', () => console.log(`Server listening on port ${options.port}`))
    this.server.on('connection', (socket, request) => this.onSocketConnected(socket, request))
  }

  private onSocketConnected(socket: WebSocket, request: IncomingMessage) {
    console.log(`Socket connected from:`, request.socket.remoteAddress);
    socket.on('message', (data) => this.onSocketMessage(socket, data))
    socket.on('close', ((code, reason) => this.onSocketClosed(socket, code, reason)))
  }
  
  onSocketMessage(socket: WebSocket, data: RawData): void {
    console.log(`Received message: ${data.toString()}`);
  }

  onSocketClosed(socket: WebSocket, code: number, reason: Buffer) {
    console.log(`Client has disconnected; code=${code}, reason=${reason}`)
  }
}