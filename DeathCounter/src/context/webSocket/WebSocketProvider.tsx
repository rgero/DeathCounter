import io, { Socket } from "socket.io-client";
import { useCallback, useEffect, useState } from "react";

import { SocketContext } from "../webSocket/WebSocketContext";
import { useDeathLists } from "../deathCounter/DeathCounterContext";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [initializedId, setInitializedId] = useState<number | undefined>(undefined);
  const { activeDeathList } = useDeathLists();

  const initializeSocket = useCallback((params: Record<string, string>) => {
    const newSocket = io(import.meta.env.VITE_WSS_URL, { query: params });
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (!activeDeathList?.id || activeDeathList.id === initializedId) return;

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
    socket.on("message", (data: { event: string; payload: string }) => {
      console.log("Received message:", data.payload);
    });
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
