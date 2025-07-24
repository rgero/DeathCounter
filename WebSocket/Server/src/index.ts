import { Server } from 'socket.io';
import { SocketHandler } from './server/SocketHandler';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

console.log(`Using encryption key: ${process.env.KEY_QUERY_PASSKEY}`);

function main() {
  // Create Express app with CORS
  const app = express();
  app.use(cors({
    origin: "*", // Allow all origins for development - restrict in production
    methods: ["GET", "POST"],
  }));
  app.use(express.json());

  // Create HTTP server
  const server = createServer(app);
  
  // Initialize Socket.IO with CORS settings
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    allowEIO3: true, // Allow older Engine.IO versions
    transports: ['websocket', 'polling'] // Support both transports
  });
  
  // Add connection debugging
  io.engine.on("connection_error", (err) => {
    console.log("Connection error:", err.req);      // the request object
    console.log("Error code:", err.code);     // the error code, for example 1
    console.log("Error message:", err.message);  // the error message, for example "Session ID unknown"
    console.log("Error context:", err.context);  // some additional error context
  });
  
  // Initialize Socket handler with Socket.IO instance
  const handler = new SocketHandler();
  handler.initialize(io);

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
  server.listen(PORT, () => {
    console.log(`HTTP server + Socket.IO listening on http://localhost:${PORT}`);
  });
}

main();