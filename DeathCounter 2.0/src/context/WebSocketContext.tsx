import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';

import { useDeathLists } from "./DeathCounterContext";

interface SocketContextType {
  socket: Socket | undefined,
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [currentToken, setCurrentToken] = useState<string | undefined>(undefined);
  const {isLoading, isFetching, activeDeathList, deathLists} = useDeathLists();

  useEffect(() => {
    console.log("=== WebSocket Debug Info ===");
    console.log("isLoading:", isLoading);
    console.log("isFetching:", isFetching);
    console.log("deathLists:", deathLists);
    console.log("activeDeathList:", activeDeathList);
    console.log("currentToken:", currentToken);
    console.log("socket exists:", !!socket);
    console.log("=========================");
    
    // Wait for data to finish loading
    if (isLoading || isFetching) {
      console.log("Still loading data, waiting...");
      return;
    }
    
    if (!activeDeathList || !activeDeathList.id) {
      console.log("No active death list found, cleaning up socket");
      if (socket) {
        socket.disconnect();
        setSocket(undefined);
      }
      setCurrentToken(undefined);
      return;
    }
    
    const newToken = activeDeathList.token ?? "";
    
    // Only create new socket if we don't have one or if the token changed
    if (socket && currentToken === newToken) {
      console.log("Socket already exists with same token, keeping existing connection");
      return;
    }
    
    // Disconnect existing socket if token changed
    if (socket && currentToken !== newToken) {
      console.log("Token changed, disconnecting existing socket");
      socket.disconnect();
    }
    
    console.log("Initializing socket with token:", newToken);
    const newSocket = io(`${import.meta.env.VITE_WSS_URL}`, {
      withCredentials: true,
      query: { token: newToken },
    });

    // Add connection event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected successfully:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);
    setCurrentToken(newToken);

    // Cleanup function
    return () => {
      console.log("Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, [activeDeathList, isLoading, isFetching, deathLists, currentToken]);


  console.log("SocketProvider initialized");
  return (
    <SocketContext.Provider 
      value={{
        socket
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const socket = useContext(SocketContext);
  return socket;
};