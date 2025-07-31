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
  
  // CORS configuration - simplified for desktop applications
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.ALLOWED_ORIGINS === '*' ? true : process.env.ALLOWED_ORIGINS?.split(',') || [])
      : "*", // Allow all origins for development
    methods: ["GET", "POST"],
    credentials: true
  };
  
  app.use(cors(corsOptions));
  app.use(express.json());

  // Health check endpoint for Docker
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Create HTTP server
  const server = createServer(app);
  
  // Initialize Socket.IO with CORS settings
  const io = new Server(server, {
    cors: corsOptions,
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