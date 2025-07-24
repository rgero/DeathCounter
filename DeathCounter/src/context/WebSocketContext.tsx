import { createContext, useCallback, useContext, useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';

import { WsEvent } from "../interfaces/WsEvent";
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

  // FUNCTIONS
  const checkGameToken = useCallback((gameToken: string|undefined) => {
    return gameToken === activeDeathList?.token;
  }, [activeDeathList?.token]);

  const processBossDeathIncrement = useCallback((event: WsEvent) => {
    if (checkGameToken(event.gameToken)) {
      console.log("Processing death increment for game")
    } else 
    {
      console.log("Invalid Token, we don't care");
    }
  }, [checkGameToken]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", ( data: {event: string; payload: string;}) => {
      console.log("Received message:", data.payload);
    });

    socket.on("bossDeathIncrement", (data: WsEvent) => {
      processBossDeathIncrement(data);
    });

    return () => {
      socket.off("message");
      socket.off("bossDeathIncrement");
    }

  }, [socket, processBossDeathIncrement]);

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
