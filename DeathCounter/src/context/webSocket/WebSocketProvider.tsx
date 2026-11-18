import React, { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

import { Entity } from "@interfaces/Entity";
import { SocketContext } from "../webSocket/WebSocketContext";
import { encryptAuthToken } from "@utils/crypt";
import { useDeathLists } from "../deathCounter/DeathCounterContext";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const { activeDeathList } = useDeathLists();
  const listToken = activeDeathList?.token;

  const emitMessage = useCallback((event: string, data?: string | number | Entity) => {
    const currentSocket = socketRef.current;

    if (!currentSocket?.connected) {
      console.warn("Attempted to emit message, but socket is not connected.");
      return;
    }

    if (!listToken) return;
    void encryptAuthToken(listToken).then(authToken => {
      if (socketRef.current !== currentSocket || !currentSocket.connected) return;
      currentSocket.emit(event, { gameToken: listToken, authToken, data });
    }).catch(() => {
      console.error('Unable to encrypt socket auth token.');
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
      void encryptAuthToken(listToken).then(authToken => {
        if (socketRef.current !== newSocket || !newSocket.connected) return;
        newSocket.emit("clientConnected", { gameToken: listToken, authToken });
      }).catch(() => {
        console.error('Unable to encrypt socket auth token.');
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
