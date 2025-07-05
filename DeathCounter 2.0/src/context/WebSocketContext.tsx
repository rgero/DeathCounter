import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

console.log(import.meta.env.VITE_WSS_URL)

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log("Creating socket connection");
    
    const newSocket = io(`${import.meta.env.VITE_WSS_URL}`, {
      withCredentials: true,
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('Connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const socket = useContext(SocketContext);
  
  if (!socket) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  
  return socket;
};