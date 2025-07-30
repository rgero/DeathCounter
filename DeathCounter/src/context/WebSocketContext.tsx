import { createContext, useCallback, useContext, useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';

import { useDeathLists } from "./DeathCounterContext";

interface SocketContextType {
  socket: Socket | undefined,
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [initializedId, setInitializedId] = useState<number | undefined>(undefined);
  const { activeDeathList } = useDeathLists();

  const initializeSocket = useCallback((params: Record<string, string>) => {
    const newSocket = io(import.meta.env.VITE_WSS_URL, {
      query: params,
    });

    setSocket(newSocket);
  }, []);

  useEffect(() => {
    // Wait for a valid activeDeathList, and avoid reconnecting for same ID
    if (!activeDeathList?.id || activeDeathList.id === initializedId) return;

    // Clean up existing socket
    if (socket) {
      console.log("Disconnecting existing socket...");
      socket.disconnect();
    }

    console.log("Initializing new socket for ID:", activeDeathList.id);
    initializeSocket({ token: activeDeathList.token || "" });
    setInitializedId(activeDeathList.id);
    
    return () => {
      if (socket) {
        console.log("Cleaning up socket on unmount...");
        socket.disconnect();
      }
    };
  }, [activeDeathList, socket, initializeSocket, initializedId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", ( data: {event: string; payload: string;}) => {
      console.log("Received message:", data.payload);
    });

  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
