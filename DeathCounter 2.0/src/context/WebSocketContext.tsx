import { createContext, useContext } from "react";

import io from 'socket.io-client';

console.log(import.meta.env.VITE_WSS_URL)

const socket = io(`${import.meta.env.VITE_WSS_URL}`, {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": `${import.meta.env.VITE_WSS_URL}`, // Match the origin allowed by Flask-SocketIO
    }
});

const SocketContext = createContext(socket);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  console.log("SocketProvider initialized");
  return (
    <SocketContext.Provider 
      value={
        socket
      }
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const socket = useContext(SocketContext);
  return socket;
};