import { ServerOptions } from 'ws';
import { SocketHandler } from './server/SocketHandler';
import dotenv from 'dotenv';

dotenv.config();

console.log(`Using encryption key: ${process.env.ENCRYPTION_KEY}`);

function main() {
  const options: ServerOptions = { port: process.env.PORT ? parseInt(process.env.PORT) : 8080 };
  const handler = new SocketHandler()
  handler.initialize(options)
}

main();