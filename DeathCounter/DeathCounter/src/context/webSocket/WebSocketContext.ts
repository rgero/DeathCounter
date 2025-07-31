import { createContext, useContext } from "react";

import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | undefined;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
