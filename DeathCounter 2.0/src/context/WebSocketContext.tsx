import { createContext, useCallback, useContext, useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';

import { useDeathLists } from "./DeathCounterContext";

interface SocketContextType {
  socket: Socket | undefined,
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const {getCurrentlyActiveDeathList} = useDeathLists();

  const initializeSocket = useCallback((params: Record<string, string>) => {
    const newSocket = io(`${import.meta.env.VITE_WSS_URL}`, {
      withCredentials: true,
      query: params,
    });
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    const activeDeathList = getCurrentlyActiveDeathList();
    if (!activeDeathList || !activeDeathList.id) return;
    if (socket) {
      socket.disconnect();
    }
    
    initializeSocket({token: activeDeathList.token ?? ""});
  }, [getCurrentlyActiveDeathList, initializeSocket, socket]);


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