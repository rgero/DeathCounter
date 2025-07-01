import { SocketHandler } from './server/SocketHandler';
import apiRoutes from './routes/apiRoutes';
import { createServer } from 'http';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

app.use('/api', apiRoutes);

const server = createServer(app);

const handler = new SocketHandler()
handler.initialize(server)

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
server.listen(PORT, () => {
  console.log(`HTTP server + WebSocket listening on http://localhost:${PORT}`);
});