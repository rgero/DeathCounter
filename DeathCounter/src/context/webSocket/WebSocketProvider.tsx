import React, { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

import { SocketContext } from "../webSocket/WebSocketContext";
import { encryptAuthToken } from "@utils/crypt";
import { useDeathLists } from "../deathCounter/DeathCounterContext";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use a ref for the actual socket to avoid dependency loops in useEffect
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const { activeDeathList } = useDeathLists();

  // We only want to re-run this effect when the specific ID or Token changes
  useEffect(() => {
    const listId = activeDeathList?.id;
    const listToken = activeDeathList?.token;

    // 1. Validation: Don't connect if we don't have the required data
    if (!listId || !listToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // 2. Cleanup: If a socket already exists for a different ID, kill it
    if (socketRef.current) {
      console.log("Disconnecting existing socket for previous ID...");
      socketRef.current.disconnect();
    }

    console.log("Initializing new socket for ID:", listId);

    // 3. Initialization: Use production-ready settings
    const newSocket = io(import.meta.env.VITE_WSS_URL, {
      query: { token: listToken },
      transports: ["websocket"], 
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    // 4. Event Listeners
    newSocket.on("connect", () => {
      console.log("Socket connected successfully:", newSocket.id);
      setIsConnected(true);
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

    // 5. Final Cleanup: Runs when the component unmounts or ID/Token changes
    return () => {
      if (newSocket) {
        console.log("Cleaning up socket...");
        newSocket.disconnect();
        socketRef.current = null;
      }
    };
  }, [activeDeathList?.id, activeDeathList?.token]); 

  const emitMessage = useCallback((event: string, data?: string | number) => {
    const currentSocket = socketRef.current;
    
    if (!currentSocket || !currentSocket.connected) {
      console.warn("Attempted to emit message, but socket is not connected.");
      return;
    }

    currentSocket.emit(event, {
      gameToken: activeDeathList?.token,
      authToken: encryptAuthToken(activeDeathList?.token || ""),
      data
    });
  }, [activeDeathList?.token]);

  return (
    <SocketContext.Provider value={{ 
      socket: socketRef.current || undefined, 
      emitMessage,
      isConnected
    }}>
      {children}
    </SocketContext.Provider>
  );
};