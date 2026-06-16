import React, { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

import { BossData } from "@interfaces/BossData";
import { SocketContext } from "../webSocket/WebSocketContext";
import { encryptAuthToken } from "@utils/crypt";
import { useDeathLists } from "../deathCounter/DeathCounterContext";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const { activeDeathList } = useDeathLists();
  const listToken = activeDeathList?.token;

  const emitMessage = useCallback((event: string, data?: string | number | BossData) => {
    const currentSocket = socketRef.current;

    if (!currentSocket?.connected) {
      console.warn("Attempted to emit message, but socket is not connected.");
      return;
    }

    currentSocket.emit(event, {
      gameToken: listToken,
      authToken: encryptAuthToken(listToken || ""),
      data,
    });
  }, [listToken]);

  useEffect(() => {
    const listId = activeDeathList?.id;

    if (!listId || !listToken) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing state when disconnecting external socket
      setSocket(undefined);
      setIsConnected(false);
      return;
    }

    socketRef.current?.disconnect();

    const newSocket = io(import.meta.env.VITE_WSS_URL, {
      query: { token: listToken },
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected successfully:", newSocket.id);
      setIsConnected(true);
      newSocket.emit("clientConnected", {
        gameToken: listToken,
        authToken: encryptAuthToken(listToken),
      });
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection Error (Check Traefik/CORS):", err.message);
    });

    newSocket.on("message", (data: { event: string; payload: string }) => {
      console.log("Received message:", data.payload);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(undefined);
      setIsConnected(false);
    };
  }, [activeDeathList?.id, listToken]);

  return (
    <SocketContext.Provider value={{ socket, emitMessage, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
