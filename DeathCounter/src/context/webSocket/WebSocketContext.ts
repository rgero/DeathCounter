import { createContext, useContext } from "react";

import { Entity } from "@interfaces/Entity";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | undefined;
  emitMessage: (event: string, data?: string|number|Entity) => void;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
