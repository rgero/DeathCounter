import { ServerOptions } from 'ws';

function main() {
  const options: ServerOptions = { port: 8080 }
  const handler = new WsHandler()
  handler.initialize(options)
}

main();