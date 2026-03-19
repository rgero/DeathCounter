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

  const emitBossDeath = () => {
    if (!socket) return;
    socket.emit("bossDeathIncrement", {
      gameToken: activeDeathList?.token
    })
  }

  const emitBossDeathDecrement = () => {
    if (!socket) return;
    socket.emit("bossDeathDecrement", {
      gameToken: activeDeathList?.token
    })
  }

  const emitBossCompleted  = () => {
    if (!socket) return;
    socket.emit("bossDefeated", {
      gameToken: activeDeathList?.token
    })
  }

  return (
    <SocketContext.Provider value={{ 
      socket,
      emitBossDeath,
      emitBossDeathDecrement,
      emitBossCompleted
    }}>
      {children}
    </SocketContext.Provider>
  );
};
