import { ServerOptions } from 'ws';
import { SocketHandler } from './server/SocketHandler';

function main() {
  const options: ServerOptions = { port: 8080 }
  const handler = new SocketHandler()
  handler.initialize(options)
}

main();